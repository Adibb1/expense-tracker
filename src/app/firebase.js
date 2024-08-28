// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpNcUfF9v0UcdeNEdqvzzO44ywH2_DqEk",
  authDomain: "finance-tracker-74a24.firebaseapp.com",
  projectId: "finance-tracker-74a24",
  storageBucket: "finance-tracker-74a24.appspot.com",
  messagingSenderId: "18713547905",
  appId: "1:18713547905:web:534a90c0d159fe2b8fa980",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication and Google provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
