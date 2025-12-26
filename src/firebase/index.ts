
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyA0gflRnyzShnAIQrM0gl4VYc_UAXBDFfk",
  authDomain: "habitos-zenith.firebaseapp.com",
  projectId: "habitos-zenith",
  storageBucket: "habitos-zenith.appspot.com",
  messagingSenderId: "329968976274",
  appId: "1:329968976274:web:ed0852ae45d60a2f16c14b",
  measurementId: "G-EXV93TJH1W"
};


// Singleton pattern to ensure Firebase is initialized only once
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let googleProvider: GoogleAuthProvider;

function initialize() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  firestore = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
}

// Initialize on load
initialize();

export { app, auth, firestore, googleProvider };
