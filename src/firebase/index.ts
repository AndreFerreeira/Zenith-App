
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

// Configuração do seu projeto Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyA0gflRnyzShnAIQrM0gl4VYc_UAXBDFfk",
  authDomain: "habitos-zenith.firebaseapp.com",
  projectId: "habitos-zenith",
  storageBucket: "habitos-zenith.appspot.com",
  messagingSenderId: "329968976274",
  appId: "1:329968976274:web:ed0852ae45d60a2f16c14b",
  measurementId: "G-EXV93TJH1W"
};

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const firestore: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
