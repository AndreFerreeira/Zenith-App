
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '@/firebase'; // Import the initialized auth instance

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
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
    // Re-throw the error to be caught by the calling UI
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<{ user: any }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error: any) {
    // Re-throw the error to be caught by the calling function
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<{ user: any }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error: any) {
    // Re-throw the error to be caught by the calling function
    throw error;
  }
};


export const signOut = async () => {
  await firebaseSignOut(auth);
};
