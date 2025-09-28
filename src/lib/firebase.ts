
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNigP1oHgcc3CIO63KDMgaIC70nMdw8pc",
  authDomain: "fam360-official.firebaseapp.com",
  projectId: "fam360-official",
  storageBucket: "fam360-official.appspot.com",
  messagingSenderId: "430792785599",
  appId: "1:430792785599:web:28f9d1fd492029eefc900a",
  measurementId: ""
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
