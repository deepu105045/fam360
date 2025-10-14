
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { Transaction } from "./types";

const env = process.env.NEXT_PUBLIC_FIREBASE_ENV || 'dev';

export const addTransaction = async (familyId: string, transaction: Omit<Transaction, 'id'>) => {
  if (!familyId) {
    throw new Error("Family ID is required to add a transaction.");
  }
  const transactionsCollection = collection(db, `fam360/${env}/families`, familyId, "transactions");
  const newTransactionData = {
    ...transaction,
    familyId,
    createdAt: serverTimestamp(),
  };

  console.log("Transaction payload:", newTransactionData);

  const docRef = await addDoc(transactionsCollection, newTransactionData);
  return docRef.id;
};
