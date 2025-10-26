
import { collection, query, where, getDocs, addDoc, doc, updateDoc, arrayUnion, arrayRemove, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { Family } from "./types";

const env = import.meta.env.VITE_FIREBASE_ENV || 'dev';
const familiesCollection = collection(db, `fam360/${env}/families`);

export const getFamiliesForUser = async (userEmail: string) => {
    const q = query(familiesCollection, where("memberEmails", "array-contains", userEmail));
    const querySnapshot = await getDocs(q);
    const families = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Family));
    return families;
};

export const createFamily = async (payload: { familyName: string, userEmail: string }) => {
    const { familyName, userEmail } = payload;
    const newFamilyRef = await addDoc(familiesCollection, {
        name: familyName,
        members: [userEmail],
        memberEmails: [userEmail],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return newFamilyRef.id;
};

export const getFamily = async (familyId: string) => {
    if (!familyId) {
        return null;
    }
    const familyDocRef = doc(db, `fam360/${env}/families`, familyId);
    const familyDoc = await getDoc(familyDocRef);
    if (familyDoc.exists()) {
        return { id: familyDoc.id, ...familyDoc.data() } as Family;
    }
    return null;
};

export const addFamilyMember = async (familyId: string, memberEmail: string) => {
    const familyDocRef = doc(db, `fam360/${env}/families`, familyId);
    await updateDoc(familyDocRef, {
        memberEmails: arrayUnion(memberEmail)
    });
};

export const removeFamilyMember = async (familyId: string, memberEmail: string) => {
    const familyDocRef = doc(db, `fam360/${env}/families`, familyId);
    await updateDoc(familyDocRef, {
        memberEmails: arrayRemove(memberEmail)
    });
};

export const getFamilyMembers = async (familyId: string) => {
    const family = await getFamily(familyId);
    return family ? family.memberEmails : [];
};

export const getAllFamilies = async () => {
    const querySnapshot = await getDocs(familiesCollection);
    const families = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Family));
    return families;
};
