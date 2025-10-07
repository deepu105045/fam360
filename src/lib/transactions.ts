
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { Transaction } from "./types";

export const addTransaction = async (familyId: string, transaction: Omit<Transaction, 'id'>) => {
  if (!familyId) {
    throw new Error("Family ID is required to add a transaction.");
  }
  const transactionsCollection = collection(db, "family_transactions", familyId, "transactions");
  const newTransactionData = {
    ...transaction,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(transactionsCollection, newTransactionData);
  return docRef.id;
};
