
import {
  doc,
  addDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { Family, Membership } from "./types";
import { getUserByEmail, getUser } from "./users";

const env = process.env.NEXT_PUBLIC_FIREBASE_ENV || 'dev';
const familiesCollection = collection(db, `fam360/${env}/families`);
const membershipsCollection = collection(db, `fam360/${env}/memberships`);

export const createFamily = async (data: {
  familyName: string;
  createdBy: string;
  memberEmails: string[];
}) => {
  const creatorUser = await getUser(data.createdBy);
  if (!creatorUser) {
    throw new Error("Family creator not found.");
  }

  const allMemberEmails = Array.from(new Set([creatorUser.email, ...data.memberEmails]));

  const familyRef = await addDoc(familiesCollection, {
    familyName: data.familyName,
    createdBy: data.createdBy,
    createdAt: serverTimestamp(),
    memberEmails: allMemberEmails,
  });

  const batch = writeBatch(db);

  for (const email of allMemberEmails) {
    const user = await getUserByEmail(email);
    if (user) {
      const membershipDocRef = doc(collection(db, `fam360/${env}/memberships`));
      batch.set(membershipDocRef, {
        familyId: familyRef.id,
        userId: user.uid,
        role: user.uid === data.createdBy ? "admin" : "member",
      });
    } else {
      console.warn(`User with email ${email} not found. Membership not created.`);
    }
  }

  await batch.commit();

  return familyRef.id;
};

export const getFamily = async (familyId: string): Promise<Family | null> => {
  const familyRef = doc(familiesCollection, familyId);
  const familySnap = await getDoc(familyRef);
  if (familySnap.exists()) {
    return familySnap.data() as Family;
  }
  return null;
};

export const getAllFamilies = async (): Promise<(Family & { id: string })[]> => {
  const querySnapshot = await getDocs(familiesCollection);
  return querySnapshot.docs.map(doc => ({ ...doc.data() as Family, id: doc.id }));
};

export const getFamiliesForUser = async (userEmail: string): Promise<(Family & { id: string })[]> => {
    const q = query(familiesCollection, where("memberEmails", "array-contains", userEmail));
    const querySnapshot = await getDocs(q);
    const families: (Family & { id: string })[] = [];
    querySnapshot.forEach((doc) => {
        families.push({ ...doc.data() as Family, id: doc.id });
    });
    return families;
};

export const getFamilyMembers = async (familyId: string): Promise<Membership[]> => {
  const q = query(membershipsCollection, where('familyId', '==', familyId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Membership);
};

export const getMembershipsForUser = async (userId: string): Promise<Membership[]> => {
  const q = query(membershipsCollection, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Membership);
}

export const addFamilyMember = async (familyId: string, memberEmail: string) => {
  const user = await getUserByEmail(memberEmail);
  if (!user) {
    throw new Error("User with that email does not exist.");
  }

  const familyRef = doc(familiesCollection, familyId);
  await updateDoc(familyRef, { 
    memberEmails: arrayUnion(memberEmail)
  });

  await addDoc(membershipsCollection, {
    familyId,
    userId: user.uid,
    role: 'member',
  } as Membership);
};
