
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { Transaction } from "./types";

const env = import.meta.env.VITE_FIREBASE_ENV || 'dev';

export const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
  const { familyId } = transaction;
  if (!familyId) {
    throw new Error("Family ID is required to add a transaction.");
  }
  const transactionsCollection = collection(db, `fam360/${env}/families`, familyId, "transactions");
  const newTransactionData = {
    ...transaction,
    createdAt: serverTimestamp(),
  };

  console.log("Transaction payload:", newTransactionData);

  const docRef = await addDoc(transactionsCollection, newTransactionData);
  return docRef.id;
};

export const updateTransaction = async (familyId: string, transactionId: string, transaction: Partial<Transaction>) => {
    if (!familyId || !transactionId) {
        throw new Error("Family ID and Transaction ID are required to update a transaction.");
    }
    const transactionDoc = doc(db, `fam360/${env}/families`, familyId, "transactions", transactionId);
    await updateDoc(transactionDoc, transaction);
};

export const deleteTransaction = async (familyId: string, transactionId: string) => {
    if (!familyId || !transactionId) {
        throw new Error("Family ID and Transaction ID are required to delete a transaction.");
    }
    const transactionDoc = doc(db, `fam360/${env}/families`, familyId, "transactions", transactionId);
    await deleteDoc(transactionDoc);
};
