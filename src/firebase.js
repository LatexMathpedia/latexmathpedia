import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { getFirestore, setDoc, doc, query, where, collection, getDocs, getDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  app,
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  getStorage,
  ref,
  getDownloadURL,
  getFirestore,
  setDoc,
  doc,
  query,
  where,
  collection,
  getDocs,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  listAll,
  initializeApp,
  getDoc
};