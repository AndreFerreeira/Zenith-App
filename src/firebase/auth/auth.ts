
import { 
    auth, 
    googleProvider 
} from '@/firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut as firebaseSignOut
} from "firebase/auth";
import { createInitialUserData } from '../firestore/data';

export async function signUpWithEmail(email: string, password: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    await createInitialUserData(user.uid, user.email, user.displayName, user.photoURL);
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle(): Promise<void> {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const { user } = userCredential;
    // Check if user data already exists before creating it
    await createInitialUserData(user.uid, user.email, user.displayName, user.photoURL);
}

export async function signOut(): Promise<void> {
    await firebaseSignOut(auth);
}
