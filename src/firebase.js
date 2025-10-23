// src/firebase.js
// ✅ Correct Firebase setup for Vite (NOT Create React App)
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚠️ Vite uses import.meta.env.VITE_ — not REACT_APP_
const firebaseConfig = {
  apiKey: "AIzaSyBTZd7r5wX1jCyzGd4tyis2HxSlX-E5oMg",
  authDomain: "ai-healthmate-c67ab.firebaseapp.com",
  projectId: "ai-healthmate-c67ab",
  storageBucket: "ai-healthmate-c67ab.firebasestorage.app",
  messagingSenderId: "689998658171",
  appId: "1:689998658171:web:a4337b30b6766b369d00de",
  measurementId: "G-E26PGH4PHV"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// ✅ Add Google Auth Provider export
export const googleProvider = new GoogleAuthProvider();

export default app;
