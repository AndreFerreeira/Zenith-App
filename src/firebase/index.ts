
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';


// NOTE: This file is updated with your project's REAL Firebase configuration.
// It is recommended to switch to environment variables for production.
export const firebaseConfig = {
  apiKey: "AIzaSyB-3fL4C4g5f6g7h8i9j0k1l2m3n4o5p6",
  authDomain: "zenith-mastery-app.firebaseapp.com",
  projectId: "zenith-mastery-app",
  storageBucket: "zenith-mastery-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0k1"
};


// Initialize Firebase
const firebaseApp: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth: Auth = getAuth(firebaseApp);
export const firestore: Firestore = getFirestore(firebaseApp);


export {
  useUser,
  useCollection,
  useDoc,
};
