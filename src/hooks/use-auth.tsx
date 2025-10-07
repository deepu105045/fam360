
"use client";

import { useState, useEffect, useContext, createContext, useCallback } from "react";
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth, signInWithEmailAndPassword } from "@/lib/firebase";
import { createUser, getUser } from "@/lib/users";
import { User as UserType } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  userDoc: UserType | null;
  loading: boolean;
  error: any;
  signInWithGoogle: () => Promise<void>;
  guestSignIn: () => Promise<void>;
  guestSignIn2: () => Promise<void>;
  signOut: () => Promise<void>;
  actions: {
    refetch: () => void;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchUserData = useCallback(async (uid: string) => {
    setLoading(true);
    try {
      const userDoc = await getUser(uid);
      setUserDoc(userDoc);
      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err);
      setUserDoc(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const existingUser = await getUser(user.uid);
        if (!existingUser) {
          await createUser(user.uid, {
            displayName: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
          });
        }
        setUser(user);
        await fetchUserData(user.uid);
      } else {
        setUser(null);
        setUserDoc(null);
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

  const guestSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, 'fam360guest@fam360.com', 'fam360guest');
    } catch (error) {
      console.error("Guest sign-in error", error);
      throw error;
    }
  };

  const guestSignIn2 = async () => {
    try {
      await signInWithEmailAndPassword(auth, 'fam360guest1@fam360.com', 'fam360guest1');
    } catch (error) {
      console.error("Guest sign-in error", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out error", error);
      throw error;
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        userDoc,
        loading,
        error,
        signInWithGoogle,
        guestSignIn,
        guestSignIn2,
        signOut,
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
