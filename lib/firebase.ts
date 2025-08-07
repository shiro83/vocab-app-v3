// ~/lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  where,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAq7Z3BnWW3HCIz6opwfNPlrQeeTdSO4Q",
  authDomain: "vocab-app-a20cc.firebaseapp.com",
  projectId: "vocab-app-a20cc",
  storageBucket: "vocab-app-a20cc.appspot.com",
  messagingSenderId: "988021918223",
  appId: "1:988021918223:web:3510ad8d6812f023de317a",
  measurementId: "G-DMWFNLKCDV",
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);

// Firestore, Auth, Provider を取得
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 明示的に使用する関数も再エクスポート
export {
  db,
  auth,
  provider,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  where,
  query,
  Timestamp,
  updateDoc,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
};
