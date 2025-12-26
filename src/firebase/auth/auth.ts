
'use client';

import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { getApp } from 'firebase/app';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const auth = getAuth(getApp());
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    return { user, token };
  } catch (error: any) {
    // Handle Errors here.
    console.error(`Google Sign-In Error: [${error.code}] ${error.message}`);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<{ user: any }> => {
  const auth = getAuth(getApp());
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error: any) {
    console.error("Email/Password Sign-Up Error:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<{ user: any }> => {
  const auth = getAuth(getApp());
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error: any) {
    console.error("Email/Password Sign-In Error:", error);
    throw error;
  }
};


export const signOut = async () => {
  const auth = getAuth(getApp());
  await firebaseSignOut(auth);
};
