
import {
  doc,
  addDoc,
  getDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { Family } from "./types";

const env = process.env.NEXT_PUBLIC_FIREBASE_ENV || 'dev';
const familiesCollection = collection(db, `fam360/${env}/families`);

export const createFamily = async (data: {
  familyName: string;
  createdBy: string;
  memberEmails: string[];
}) => {
  const familyRef = await addDoc(familiesCollection, {
    familyName: data.familyName,
    createdBy: data.createdBy,
    createdAt: serverTimestamp(),
    memberEmails: data.memberEmails,
  });

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
