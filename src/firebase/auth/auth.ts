'use client';

import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { getApp } from 'firebase/app';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const auth = getAuth(getApp());
  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    return { user, token };
  } catch (error: any) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData?.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error("Google Sign-In Error:", { errorCode, errorMessage, email, credential });
    throw error;
  }
};

export const signOut = async () => {
  const auth = getAuth(getApp());
  await firebaseSignOut(auth);
};
