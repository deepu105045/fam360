
import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import type {
  UserDoc,
  UserFamilyMembership,
  FamilyDoc,
  FamilyMemberDoc,
  FamilyInvitationDoc,
} from "./types";

const env = process.env.NEXT_PUBLIC_ENV || "dev";
const FAM360 = "fam360";
const USERS = "users";
const FAMILIES = "families";
const INVITES = "invitations";

// --- User Functions ---

export async function getUserDoc(userId: string): Promise<UserDoc | null> {
  const ref = doc(db, FAM360, env, USERS, userId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

export async function upsertUserDoc(
  userId: string,
  partial: Partial<UserDoc>
): Promise<void> {
  const ref = doc(db, FAM360, env, USERS, userId);
  const now = Date.now();
  await setDoc(
    ref,
    {
      uid: userId,
      families: [],
      createdAt: now,
      ...partial,
      updatedAt: now,
    },
    { merge: true }
  );

  // Check for and process any pending invitations for this user
  await processPendingInvitations(userId, partial.email);
}

// --- Family Functions ---

export async function getFamiliesForUser(
  userId: string
): Promise<Array<{ id: string; data: FamilyDoc }>> {
  const user = await getUserDoc(userId);
  if (!user || !user.families || user.families.length === 0) return [];

  const results: Array<{ id: string; data: FamilyDoc }> = [];
  for (const membership of user.families) {
    const ref = doc(db, FAM360, env, FAMILIES, membership.familyId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      results.push({ id: snap.id, data: snap.data() as FamilyDoc });
    }
  }
  console.log(`User ${userId} is part of families:`, results);
  return results;
}

export async function createFamily(params: {
  familyName: string;
  createdBy: string;
  memberEmails?: string[];
}): Promise<string> {
  const now = Date.now();
  const batch = writeBatch(db);

  // 1. Create the family document
  const familiesCol = collection(db, FAM360, env, FAMILIES);
  const familyRef = doc(familiesCol); // Auto-generate ID
  const familyDoc: FamilyDoc = {
    familyName: params.familyName,
    createdBy: params.createdBy,
    createdAt: now,
    updatedAt: now,
  };
  batch.set(familyRef, familyDoc);

  // 2. Add creator as a member of the family
  await addMemberToFamily(
    batch,
    familyRef.id,
    params.createdBy,
    "admin",
    now
  );

  // 3. Create invitations for each member email.
  if (params.memberEmails && params.memberEmails.length > 0) {
    for (const email of params.memberEmails) {
      const normalizedEmail = email.toLowerCase().trim();
      const inviteRef = doc(collection(db, FAM360, env, FAMILIES, familyRef.id, INVITES));
      const inviteDoc: FamilyInvitationDoc = {
        email: normalizedEmail,
        role: "member",
        invitedAt: now,
      };
      batch.set(inviteRef, inviteDoc);
    }
  }

  await batch.commit();

  return familyRef.id;
}

// --- Member & Invitation Functions ---

async function addMemberToFamily(
  batch: any, // Can be a writeBatch or the db itself
  familyId: string,
  userId: string,
  role: "admin" | "member",
  now: number
) {
  // Add member to family's members sub-collection
  const memberRef = doc(db, FAM360, env, FAMILIES, familyId, "members", userId);
  const memberDoc: FamilyMemberDoc = { userId, role, joinedAt: now };
  batch.set(memberRef, memberDoc);

  // Update member's user doc with the new family
  const userRef = doc(db, FAM360, env, USERS, userId);
  const userSnap = await getDoc(userRef);
  const userData = (userSnap.exists() ? userSnap.data() : { uid: userId, families: [] }) as UserDoc;
  const userFamiliesArr: UserFamilyMembership[] = Array.isArray(userData.families)
    ? [...userData.families]
    : [];

  if (!userFamiliesArr.find((f) => f.familyId === familyId)) {
    userFamiliesArr.push({ familyId, role });
  }

  batch.set(userRef, { ...userData, families: userFamiliesArr, updatedAt: now }, { merge: true });
}

async function processPendingInvitations(
  userId: string,
  email: string | null | undefined
) {
  if (!email) return;

  const normalizedEmail = email.toLowerCase().trim();
  const familiesCol = collection(db, FAM360, env, FAMILIES);
  const allFamiliesSnap = await getDocs(familiesCol);

  for (const familyDoc of allFamiliesSnap.docs) {
    const familyId = familyDoc.id;
    const invitesCol = collection(db, FAM360, env, FAMILIES, familyId, INVITES);
    const q = query(invitesCol, where("email", "==", normalizedEmail));
    const invitesSnap = await getDocs(q);

    if (!invitesSnap.empty) {
      console.log(`User ${email} has pending invitations in family ${familyId}:`, invitesSnap.docs.map(d => d.data()));
      const batch = writeBatch(db);
      const now = Date.now();

      for (const inviteDoc of invitesSnap.docs) {
        const inviteData = inviteDoc.data() as FamilyInvitationDoc;
        
        // 1. Add user as a member to the family
        await addMemberToFamily(batch, familyId, userId, inviteData.role, now);

        // 2. Delete the invitation
        batch.delete(inviteDoc.ref);

        console.log(`Processed invitation for ${email} to join family ${familyId}`);
      }
      await batch.commit();
    }
  }
}
