
export type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: number;
  lastLogin: number;
  primaryFamily?: string;
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
  id: string;
  familyId: string;
  type: TransactionType;
  date: Date;
  category: string;
  amount: number;
  paidBy: string;
  description: string;
};

export enum AssetType {
    RealEstate = "Real Estate",
    BankDeposit = "Bank Deposit",
    BankRD = "Bank RD",
    Insurance = "Insurance",
    Equity = "Equity",
    MutualFund = "Mutual Fund",
    NPS = "NPS",
    PPF = "PPF",
    Other = "Other"
}

export type Asset = {
    id: string;
    familyId: string;
    type: AssetType;
    name: string;
    amount: number;
    accountNumber?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
};
