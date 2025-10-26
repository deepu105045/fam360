
import {
  doc,
  getDoc,
  setDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { User } from "./types";

const env = import.meta.env.VITE_FIREBASE_ENV || 'dev';
const usersCollection = collection(db, `fam360/${env}/users`);

export const createUser = async (
  uid: string,
  data: Omit<User, "createdAt" | "lastLogin" | "uid">
) => {
  const userRef = doc(usersCollection, uid);
  await setDoc(userRef, {
    ...data,
    uid,
    families: [],
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  });
};

export const getUser = async (uid: string): Promise<User | null> => {
  const userRef = doc(usersCollection, uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return { ...userSnap.data(), uid: userSnap.id } as User;
  }
  return null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const q = query(usersCollection, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return { ...userDoc.data(), uid: userDoc.id } as User;
  }
  return null;
};
