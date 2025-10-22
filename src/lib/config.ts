import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface QuickCategories {
  expense: string[];
  income: string[];
  investment: string[];
}

export const getQuickCategories = async (): Promise<QuickCategories | null> => {
  const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
  const docRef = doc(db, `fam360/${env}/config/quick-categories`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      expense: data.Expense || [],
      income: data.Income || [],
      investment: data.Investment || [],
    };
  } else {
    console.log("No such document!");
    return null;
  }
};
