import { collection, query, where, getDocs, addDoc, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Family } from "./types";

const env = process.env.NEXT_PUBLIC_FIREBASE_ENV || 'dev';
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
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    return newFamilyRef.id;
};

export const getFamily = async (familyId: string) => {
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
