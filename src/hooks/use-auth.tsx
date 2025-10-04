
"use client";

import { useState, useEffect, useContext, createContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserDoc } from "@/lib/families";
import { UserDoc, FamilyDoc } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  userDoc: UserDoc | null;
  families: FamilyDoc[];
  loading: boolean;
  error: any;
  actions: {
    refetchFamilies: () => void;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [families, setFamilies] = useState<FamilyDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchFamilies = async (uid: string) => {
    try {
      const userDoc = await getUserDoc(uid);
      setUserDoc(userDoc);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchFamilies(user.uid);
      } else {
        setUser(null);
        setUserDoc(null);
        setFamilies([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userDoc,
        families,
        loading,
        error,
        actions: { refetchFamilies: () => user && fetchFamilies(user.uid) },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
