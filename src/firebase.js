import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, EmailAuthCredential, reauthenticateWithCredential } from "firebase/auth";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { getFirestore, setDoc, doc, query, where, collection, getDocs, getDoc, addDoc, updateDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export {
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
  getDoc,
  addDoc,
  updatePassword,
  updateDoc,
  EmailAuthCredential,
  reauthenticateWithCredential
};