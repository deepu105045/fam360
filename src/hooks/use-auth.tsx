
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  User
} from 'firebase/auth';
import { auth, signInWithEmailAndPassword } from '@/lib/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  guestSignIn: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? "User signed in" : "User signed out");
      if (user) {
        console.log("User details:", {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        });
        
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
      const result = await signInWithPopup(auth, provider);
      // User is automatically signed in, no need for additional redirect
      return result;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false);
      throw error;
    }
  };

  const guestSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, 'Guest@fam360.com', 'Fam360guest');
    } catch (error) {
      console.error("Error signing in as guest:", error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };
  
  const value = { user, loading, signInWithGoogle, guestSignIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
