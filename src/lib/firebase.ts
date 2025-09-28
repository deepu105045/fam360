
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "fam360",
  "appId": "1:430792785599:web:28f9d1fd492029eefc900a",
  "apiKey": "AIzaSyBNigP1oHgcc3CIO63KDMgaIC70nMdw8pc",
  "authDomain": "fam360.firebaseapp.com",
  "storageBucket": "fam360.appspot.com",
  "messagingSenderId": "430792785599",
  "measurementId": "G-7E5J1P3T5N"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
