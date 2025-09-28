
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  GoogleAuthProvider, 
  signInWithRedirect,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const db = getFirestore();
        const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
        const userRef = doc(db, `fam360/${env}/users`, user.uid);
        
        try {
          await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          }, { merge: true });
        } catch (error) {
          console.error("Error writing user to Firestore:", error);
        }

        setUser(user);
        localStorage.setItem('auth_user', 'true');
      } else {
        setUser(null);
        localStorage.removeItem('auth_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };
  
  const value = { user, loading, signInWithGoogle, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
