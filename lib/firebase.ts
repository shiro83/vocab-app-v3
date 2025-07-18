import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAq7Z3BnWW3HCIz6opwfNPlrQeeTdSO4Q",
  authDomain: "vocab-app-a20cc.firebaseapp.com",
  projectId: "vocab-app-a20cc",
  storageBucket: "vocab-app-a20cc.appspot.com",
  messagingSenderId: "988021918223",
  appId: "1:988021918223:web:3510ad8d6812f023de317a",
  measurementId: "G-DMWFNLKCDV",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export { signInWithPopup, signOut };
