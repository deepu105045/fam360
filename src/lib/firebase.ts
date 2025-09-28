
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-5926457398-92ea0",
  "appId": "1:430792785599:web:28f9d1fd492029eefc900a",
  "apiKey": "AIzaSyBNigP1oHgcc3CIO63KDMgaIC70nMdw8pc",
  "authDomain": "studio-5926457398-92ea0.firebaseapp.com",
  "storageBucket": "studio-5926457398-92ea0.appspot.com",
  "messagingSenderId": "430792785599",
  "measurementId": "G-7E5J1P3T5N"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
