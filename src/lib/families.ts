
import {
  doc,
  addDoc,
  getDoc,
  setDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { Family, Membership } from "./types";
import { getUserByEmail } from "./users";

const env = process.env.NEXT_PUBLIC_FIREBASE_ENV || 'dev';
const familiesCollection = collection(db, `fam360/${env}/families`);
const membershipsCollection = collection(db, `fam360/${env}/memberships`);

export const createFamily = async (uid: string, familyName: string) => {
  const familyRef = await addDoc(familiesCollection, {
    familyName,
    createdBy: uid,
    createdAt: serverTimestamp(),
  });

  await addDoc(membershipsCollection, {
    familyId: familyRef.id,
    userId: uid,
    role: "admin",
    joinedAt: serverTimestamp(),
  });

  return familyRef.id;
};

export const addFamilyMember = async (familyId: string, email: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  await addDoc(membershipsCollection, {
    familyId,
    userId: user.uid,
    role: "member",
    joinedAt: serverTimestamp(),
  });
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

export const getFamilyMembers = async (familyId: string): Promise<Membership[]> => {
  const q = query(membershipsCollection, where("familyId", "==", familyId));
  const querySnapshot = await getDocs(q);
  const members: Membership[] = [];
  querySnapshot.forEach((doc) => {
    members.push(doc.data() as Membership);
  });
  return members;
};

export const getMembershipsForUser = async (userId: string): Promise<Membership[]> => {
    const q = query(membershipsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const memberships: Membership[] = [];
    querySnapshot.forEach((doc) => {
        memberships.push(doc.data() as Membership);
    });
    return memberships;
};
