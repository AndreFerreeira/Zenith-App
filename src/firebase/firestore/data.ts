import { collection, addDoc, doc, updateDoc, deleteDoc, setDoc, type Firestore, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

// Define interfaces based on docs/backend.json
export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
}

export interface AnnualGoal {
    id: string;
    text: string;
    completed: boolean;
    category: "Pessoais" | "Profissionais" | "Materiais";
}

export interface UserDocument {
    profile?: UserProfile;
    dreamRoutine?: string;
    coreValues?: string;
    financialGoal?: number;
    aiNotes?: string;
}

// --- Annual Goals ---
export const addAnnualGoal = (firestore: Firestore, userId: string, goal: Omit<AnnualGoal, 'id'>) => {
    const goalsCollection = collection(firestore, 'users', userId, 'annualGoals');
    addDoc(goalsCollection, goal)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: goalsCollection.path,
                operation: 'create',
                requestResourceData: goal,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
};

export const updateAnnualGoal = (firestore: Firestore, userId: string, goalId: string, updates: Partial<AnnualGoal>) => {
    const goalDoc = doc(firestore, 'users', userId, 'annualGoals', goalId);
    updateDoc(goalDoc, updates)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: goalDoc.path,
                operation: 'update',
                requestResourceData: updates,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
};

export const deleteAnnualGoal = (firestore: Firestore, userId: string, goalId: string) => {
    const goalDoc = doc(firestore, 'users', userId, 'annualGoals', goalId);
    deleteDoc(goalDoc)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: goalDoc.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
};

// --- User Document ---
export const updateUserDocument = (firestore: Firestore, userId: string, updates: Partial<UserDocument>) => {
    const userDocRef = doc(firestore, 'users', userId);
    setDoc(userDocRef, updates, { merge: true })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: updates,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
};
