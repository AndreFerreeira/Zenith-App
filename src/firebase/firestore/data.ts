
import { collection, addDoc, doc, updateDoc, deleteDoc, setDoc, getDoc, getDocs, query, where, type Firestore, writeBatch, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';

// Helper function to get a user document reference
const userDocRef = (userId: string) => doc(firestore, 'users', userId);

// Function to check if a user document exists
export async function userExists(userId: string): Promise<boolean> {
    const docSnap = await getDoc(userDocRef(userId));
    return docSnap.exists();
}

// Initial data for new users
const initialData = {
    weeklyPlan: [
        { day: 'Segunda', tasks: [] },
        { day: 'Terça', tasks: [] },
        { day: 'Quarta', tasks: [] },
        { day: 'Quinta', tasks: [] },
        { day: 'Sexta', tasks: [] },
        { day: 'Sábado', tasks: [] },
        { day: 'Domingo', tasks: [] },
    ]
};

// Function to create initial user data
export async function createInitialUserData(userId: string, email: string | null, displayName: string | null, photoURL: string | null) {
    const userRef = userDocRef(userId);
    const userDocSnap = await getDoc(userRef);

    if (!userDocSnap.exists()) {
        const batch = writeBatch(firestore);

        // Set top-level user document
        batch.set(userRef, {
            profile: { uid: userId, email, displayName, photoURL },
            dreamRoutine: "",
            coreValues: "",
            financialGoal: 0,
            aiNotes: "",
            quickNotes: "",
            aiMessages: [],
        });

        // Set initial weekly plan
        const weeklyPlanCollectionRef = collection(firestore, 'users', userId, 'weeklyPlans');
        initialData.weeklyPlan.forEach(day => {
            const dayDocRef = doc(weeklyPlanCollectionRef);
            batch.set(dayDocRef, day);
        });

        await batch.commit();
    }
}
