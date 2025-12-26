
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyB-3fL4C4g5f6g7h8i9j0k1l2m3n4o5p6",
  authDomain: "zenith-mastery-app.firebaseapp.com",
  projectId: "zenith-mastery-app",
  storageBucket: "zenith-mastery-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0k1"
};

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const firestore: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
