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
