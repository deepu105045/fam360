
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";
import { Family, User } from "./types";

/**
 * Gets the families a user is a member of.
 * @param uid The user's ID.
 * @returns A list of family IDs.
 */
export const getUserFamilies = async (uid: string): Promise<string[]> => {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return [];
  }
  const userDoc = querySnapshot.docs[0];
  return userDoc.data().families || [];
};

/**
 * Gets a family by its ID.
 * @param familyId The family's ID.
 * @returns The family data, or null if it doesn't exist.
 */
export const getFamilyById = async (familyId: string): Promise<Family | null> => {
  const docRef = doc(db, "families", familyId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Family;
  } else {
    return null;
  }
};

/**
 * Creates a new family.
 * @param familyName The name of the new family.
 * @param adminId The ID of the user creating the family.
 * @returns The ID of the newly created family.
 */
export const createFamily = async (
  familyName: string,
  adminId: string
): Promise<string> => {
  const newFamilyRef = await addDoc(collection(db, "families"), {
    name: familyName,
    members: [{ uid: adminId, role: "admin" }],
  });

  // Add the family to the user's list of families
  const userQuery = query(collection(db, "users"), where("uid", "==", adminId));
  const userSnapshot = await getDocs(userQuery);
  if (!userSnapshot.empty) {
    const userDocRef = userSnapshot.docs[0].ref;
    await updateDoc(userDocRef, {
      families: arrayUnion(newFamilyRef.id),
    });
  }

  return newFamilyRef.id;
};

/**
 * Adds a member to a family.
 * @param familyId The family's ID.
 * @param userId The ID of the user to add.
 */
export const addFamilyMember = async (
  familyId: string,
  userId: string
): Promise<void> => {
  const familyRef = doc(db, "families", familyId);
  await updateDoc(familyRef, {
    members: arrayUnion({ uid: userId, role: "member" }),
  });

  // Add the family to the user's list of families
  const userQuery = query(collection(db, "users"), where("uid", "==", userId));
  const userSnapshot = await getDocs(userQuery);
  if (!userSnapshot.empty) {
    const userDocRef = userSnapshot.docs[0].ref;
    await updateDoc(userDocRef, {
      families: arrayUnion(familyId),
    });
  }
};

/**
 * Gets a user by their email address.
 * @param email The user's email.
 * @returns The user data, or null if it doesn't exist.
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    return { ...userDoc.data() } as User;
  };
  
