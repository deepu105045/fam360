"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { auth, signInWithEmailAndPassword } from '@/lib/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  guestSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = getFirestore();

  // Use NEXT_PUBLIC_ENV (dev/prod), fallback to "dev"
  const env = process.env.NEXT_PUBLIC_ENV || 'dev';

  /**
   * Check if user is part of a family
   */
  const checkUserFamily = async (user: User) => {
    const userRef = doc(db, `fam360/${env}/users/${user.uid}`);

    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.families && Array.isArray(userData.families) && userData.families.length > 0) {
          console.log('✅ User is part of families:', userData.families);
          return true;
        }
        console.log('ℹ️ User is not part of any family.');
        return false;
      } else {
        console.log("⚠️ No user document found for UID:", user.uid);
        return false;
      }
    } catch (error: any) {
      console.error("❌ Error checking user family:", error.message, error);
      return false; // fallback but still logged
    }
  };

  /**
   * Auth state listener
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User details:", JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }));
        try {
          const userRef = doc(db, `fam360/${env}/users/${user.uid}`);

          await setDoc(
            userRef,
            {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            },
            { merge: true }
          );


          const hasFamily = await checkUserFamily(user);
        } catch (error: any) {
          console.error("❌ Error in onAuthStateChanged user block:", error.message, error);
        }

        setUser(user);
      } else {
        console.log("Auth state is signed out.");
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      console.log("Unsubscribing from onAuthStateChanged.");
      unsubscribe();
    };
  }, []);

  /**
   * Google sign-in
   */
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("❌ Error signing in with Google:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guest sign-in
   */
  const guestSignIn = async () => {
    console.log("-> Entering guestSignIn");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, 'fam360Guest@fam360.com', 'fam360Guest');
      console.log("✅ signInWithEmailAndPassword successful.");
    } catch (error) {
      console.error("❌ Error in guestSignIn:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    router.push('/');
  };

  const value = { user, loading, signInWithGoogle, guestSignIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook for consuming AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
