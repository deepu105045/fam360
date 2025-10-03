
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

export type UserFamilyMembership = {
  familyId: string;
  role: "admin" | "member";
};

export type UserDoc = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  families: UserFamilyMembership[];
  createdAt: number;
  updatedAt: number;
};

export type FamilyDoc = {
  familyName: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
};

export type FamilyMemberDoc = {
  userId: string;
  role: "admin" | "member";
  joinedAt: number;
};

export type FamilyInvitationDoc = {
  email: string;
  role: "admin" | "member";
  invitedAt: number;
};
