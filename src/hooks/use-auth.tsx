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
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  familyCheckLoading: boolean; // New state to track family check
  signInWithGoogle: () => Promise<void>;
  guestSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [familyCheckLoading, setFamilyCheckLoading] = useState(true);
  const router = useRouter();
  const db = getFirestore();
  const pathname = usePathname();

  const env = process.env.NEXT_PUBLIC_ENV || 'dev';

  const checkUserFamily = async (user: User) => {
    const userRef = doc(db, `fam360/${env}/users/${user.uid}`);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.families && Array.isArray(userData.families) && userData.families.length > 0) {
          return true;
        }
      }
      return false;
    } catch (error: any) {
      console.error("Error checking user family:", error.message, error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setFamilyCheckLoading(true);
      if (user) {
        setUser(user);
        try {
          const userRef = doc(db, `fam360/${env}/users/${user.uid}`);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.displayName !== user.displayName || userData.email !== user.email || userData.photoURL !== user.photoURL) {
              await setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
              }, { merge: true });
            }
          } else {
            await setDoc(userRef, {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            });
          }

          const hasFamily = await checkUserFamily(user);
          if (!hasFamily && pathname !== '/family-create') {
            router.push('/family-create');
          }
        } catch (error: any) {
          console.error("Error in onAuthStateChanged:", error.message, error);
        } finally {
          setLoading(false);
          setFamilyCheckLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
        setFamilyCheckLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const guestSignIn = async () => {
    await signInWithEmailAndPassword(auth, 'fam360Guest@fam360.com', 'fam360Guest');
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    router.push('/');
  };

  const value = { user, loading, familyCheckLoading, signInWithGoogle, guestSignIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
