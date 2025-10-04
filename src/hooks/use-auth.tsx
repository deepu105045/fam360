
"use client";

import { useState, useEffect, useContext, createContext, useCallback } from "react";
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, guestSignIn } from "@/lib/firebase";
import { getUserDoc, getFamiliesForUser } from "@/lib/families";
import { UserDoc, FamilyDoc } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  userDoc: UserDoc | null;
  families: Array<{ id: string; data: FamilyDoc }>;
  loading: boolean;
  error: any;
  signInWithGoogle: () => Promise<void>;
  guestSignIn: () => Promise<void>;
  actions: {
    refetch: () => void;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [families, setFamilies] = useState<Array<{ id: string; data: FamilyDoc }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchUserData = useCallback(async (uid: string) => {
    setLoading(true);
    try {
      const userDocPromise = getUserDoc(uid);
      const familiesPromise = getFamiliesForUser(uid);

      const [userDoc, families] = await Promise.all([userDocPromise, familiesPromise]);

      setUserDoc(userDoc);
      setFamilies(families || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err);
      setUserDoc(null);
      setFamilies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchUserData(user.uid);
      } else {
        setUser(null);
        setUserDoc(null);
        setFamilies([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  const refetch = useCallback(() => {
    if (user) {
      fetchUserData(user.uid);
    }
  }, [user, fetchUserData]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in error", error);
      throw error;
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        userDoc,
        families,
        loading,
        error,
        signInWithGoogle,
        guestSignIn,
        actions: { refetch },
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
