
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBELonaNwysF-H-MPtadqHJeEzNKWAqhvs",
  authDomain: "fam360-official.firebaseapp.com",
  projectId: "fam360-official",
  storageBucket: "fam360-official.firebasestorage.app",
  messagingSenderId: "88183606781",
  appId: "1:88183606781:web:5086e666336f8c51cddd94",
  measurementId: "G-QSVX0R2NQH"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const guestSignIn = () => signInAnonymously(auth);

export { app, auth, db, signInWithEmailAndPassword, guestSignIn };

