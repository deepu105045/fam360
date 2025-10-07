
export type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: number;
  lastLogin: number;
};

export type Family = {
  familyName: string;
  createdBy: string;
  createdAt: number;
  memberEmails: string[];
};

export type Membership = {
  userId: string;
  familyId: string;
  role: 'admin' | 'member';
};

export type TransactionType = "expense" | "income" | "investment";

export type Transaction = {
  id: number;
  type: TransactionType;
  date: Date;
  category: string;
  amount: number;
  paidBy: string;
  investmentType?: string;
  institution?: string;
  roi?: number;
  source?: string;
  frequency?: "one-time" | "recurring";
};
