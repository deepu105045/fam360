
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNigP1oHgcc3CIO63KDMgaIC70nMdw8pc",
  authDomain: "studio-5926457398-92ea0.firebaseapp.com",
  projectId: "studio-5926457398-92ea0",
  storageBucket: "studio-5926457398-92ea0.firebasestorage.app",
  messagingSenderId: "430792785599",
  appId: "1:430792785599:web:d901d11c64510e56fc900a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
