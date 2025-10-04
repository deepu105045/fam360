
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
};

export type Membership = {
  familyId: string;
  userId: string;
  role: "admin" | "member";
  joinedAt: number;
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
