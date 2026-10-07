import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForDhangoNepalDevelopment2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dhango-nepal.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dhango-nepal",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dhango-nepal.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1092837465",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1092837465:web:abcdef123456"
};

let app;
let auth;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
} catch (error) {
  console.warn('[Firebase] Initialized with local dev configuration:', error.message);
}

export const googleProvider = new GoogleAuthProvider();
export { auth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
