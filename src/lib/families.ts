import { db } from "./firebase";
import { doc, getDoc, setDoc, collection, addDoc, writeBatch } from "firebase/firestore";
import type { UserDoc, UserFamilyMembership, FamilyDoc, FamilyMemberDoc } from "./types";

const env = process.env.NEXT_PUBLIC_ENV || "dev";
const FAM360 = "fam360";
const USERS = "users";
const FAMILIES = "families";

export async function getUserDoc(userId: string): Promise<UserDoc | null> {
  const ref = doc(db, FAM360, env, USERS, userId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

export async function upsertUserDoc(userId: string, partial: Partial<UserDoc>): Promise<void> {
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
}

export async function getFamiliesForUser(userId: string): Promise<Array<{ id: string; data: FamilyDoc }>> {
  const user = await getUserDoc(userId);
  if (!user || !user.families || user.families.length === 0) return [];
  const results: Array<{ id: string; data: FamilyDoc }> = [];
  for (const membership of user.families) {
    const ref = doc(db, FAM360, env, FAMILIES, membership.familyId);
    const snap = await getDoc(ref);
    if (snap.exists()) results.push({ id: snap.id, data: snap.data() as FamilyDoc });
  }
  return results;
}

export async function createFamily(params: { familyName: string; createdBy: string }): Promise<string> {
  const now = Date.now();
  const batch = writeBatch(db);

  const familiesCol = collection(db, FAM360, env, FAMILIES);
  const familyDoc: FamilyDoc = {
    familyName: params.familyName,
    createdBy: params.createdBy,
    createdAt: now,
    updatedAt: now,
  };
  const familyRef = doc(familiesCol); // Create a new doc with a random ID
  batch.set(familyRef, familyDoc);

  // Add creator as admin in sub-collection
  const memberRef = doc(db, FAM360, env, FAMILIES, familyRef.id, "members", params.createdBy);
  const memberDoc: FamilyMemberDoc = { userId: params.createdBy, role: "admin", joinedAt: now };
  batch.set(memberRef, memberDoc);

  // Update user membership
  const userRef = doc(db, FAM360, env, USERS, params.createdBy);
  const userSnap = await getDoc(userRef);
  const userData = (userSnap.exists() ? userSnap.data() : { uid: params.createdBy, families: [] }) as UserDoc;
  const familiesArr: UserFamilyMembership[] = Array.isArray(userData.families) ? [...userData.families] : [];
  familiesArr.push({ familyId: familyRef.id, role: "admin" });
  batch.set(userRef, { ...userData, families: familiesArr, updatedAt: now }, { merge: true });

  await batch.commit();

  return familyRef.id;
}

export async function addMemberToFamily(params: { familyId: string; userId: string; role: "admin" | "member" }): Promise<void> {
  const now = Date.now();
  const batch = writeBatch(db);

  const memberRef = doc(db, FAM360, env, FAMILIES, params.familyId, "members", params.userId);
  const memberDoc: FamilyMemberDoc = { userId: params.userId, role: params.role, joinedAt: now };
  batch.set(memberRef, memberDoc);

  const userRef = doc(db, FAM360, env, USERS, params.userId);
  const userSnap = await getDoc(userRef);
  const userData = (userSnap.exists() ? userSnap.data() : { uid: params.userId, families: [] }) as UserDoc;
  const familiesArr: UserFamilyMembership[] = Array.isArray(userData.families) ? [...userData.families] : [];
  if (!familiesArr.find((f) => f.familyId === params.familyId)) {
    familiesArr.push({ familyId: params.familyId, role: params.role });
  }
  batch.set(userRef, { ...userData, families: familiesArr, updatedAt: now }, { merge: true });

  await batch.commit();
}

export async function removeMemberFromFamily(params: { familyId: string; userId: string }): Promise<void> {
  // Left as an exercise: delete member doc and update users/{uid}.families[] accordingly
}
