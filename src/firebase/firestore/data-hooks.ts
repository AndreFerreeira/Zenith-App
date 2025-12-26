
'use client';

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  writeBatch,
  setDoc,
} from 'firebase/firestore';
import { firestore } from '@/firebase';
import { useCollection } from './use-collection';
import { useDoc } from './use-doc';
import React from 'react';
import { errorEmitter } from "../error-emitter";
import { FirestorePermissionError } from "../errors";

// --- Types ---
export type AnnualGoal = {
  id: string;
  text: string;
  completed: boolean;
  category: 'Pessoais' | 'Profissionais' | 'Materiais';
};

export type Habit = {
  id: string;
  name: string;
  month: string; // YYYY-MM
  completedDays: number[];
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'entrada' | 'saida';
  date: string; // ISO String
};

export type WishlistItem = {
  id: string;
  name: string;
};

export type TaskCategory = 'PESSOAL' | 'PROFISSIONAL' | 'MATERIAL';

export type WeeklyTask = {
  name: string;
  category: TaskCategory;
};

export type WeeklyDay = {
  id: string;
  day: string;
  tasks: WeeklyTask[];
};

export type MonthlyStrategy = {
  id: string;
  month: string; // YYYY-MM
  focus?: string;
  wins?: string;
  learnings?: string;
};

export type UserDocument = {
  dreamRoutine?: string;
  coreValues?: string;
  financialGoal?: number;
  aiNotes?: string;
  quickNotes?: string;
  aiMessages?: any[];
};

// --- Hooks ---

export const useUserDocument = (userId?: string) => {
  const path = userId ? `users/${userId}` : null;
  return useDoc<UserDocument>(path);
};

export const useAnnualGoals = (userId?: string) => {
  const path = userId ? `users/${userId}/annualGoals` : null;
  return useCollection<AnnualGoal>(path);
};

export const useHabits = (userId?: string, month?: string) => {
  const collectionRef = userId ? collection(firestore, `users/${userId}/habits`) : null;
  const q = React.useMemo(() => {
    if (!collectionRef) return null;
    return month ? query(collectionRef, where('month', '==', month)) : collectionRef;
  }, [collectionRef, month]);
  return useCollection<Habit>(q);
};


export const useTransactions = (userId?: string) => {
  const path = userId ? `users/${userId}/transactions` : null;
  return useCollection<Transaction>(path);
};

export const useWishlist = (userId?: string) => {
  const path = userId ? `users/${userId}/wishlist` : null;
  return useCollection<WishlistItem>(path);
};

export const useWeeklyPlan = (userId?: string) => {
    const path = userId ? `users/${userId}/weeklyPlans` : null;
    return useCollection<WeeklyDay>(path, { listen: true });
};

export const useMonthlyStrategy = (userId?: string, month?: string) => {
    const collectionRef = userId ? collection(firestore, `users/${userId}/monthlyStrategies`) : null;
    const q = React.useMemo(() => {
        if (!collectionRef) return null;
        return month ? query(collectionRef, where('month', '==', month)) : null;
    }, [collectionRef, month]);
    
    const { data, isLoading } = useCollection<MonthlyStrategy>(q);
    
    // Since we expect only one doc, we extract it.
    const strategyDoc = data && data.length > 0 ? data[0] : null;

    return { data: strategyDoc, isLoading };
};

export const useAiMessages = (userId?: string) => {
    const { data: userDoc, isLoading } = useUserDocument(userId);
    return { data: userDoc?.aiMessages || [], isLoading };
};

// --- Firestore Write Operations ---

// General document update (using setDoc with merge for safety)
export const updateUserDocument = (userId: string, data: Partial<UserDocument>) => {
  const userDocRef = doc(firestore, 'users', userId);
  return setDoc(userDocRef, data, { merge: true }).catch(async (serverError) => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'update', // Logically an update, even if using set+merge
        requestResourceData: data
    }));
  });
};

// Annual Goals
export const addAnnualGoal = (userId: string, goal: Omit<AnnualGoal, 'id'>) => {
  const goalsCollectionRef = collection(firestore, 'users', userId, 'annualGoals');
  return addDoc(goalsCollectionRef, goal).catch(async (serverError) => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: goalsCollectionRef.path,
        operation: 'create',
        requestResourceData: goal
    }));
  });
};

export const updateAnnualGoal = (userId: string, goalId: string, data: Partial<AnnualGoal>) => {
  const goalDocRef = doc(firestore, 'users', userId, 'annualGoals', goalId);
  return updateDoc(goalDocRef, data).catch(async (serverError) => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: goalDocRef.path,
        operation: 'update',
        requestResourceData: data
    }));
  });
};

export const deleteAnnualGoal = (userId: string, goalId: string) => {
  const goalDocRef = doc(firestore, 'users', userId, 'annualGoals', goalId);
  return deleteDoc(goalDocRef).catch(async (serverError) => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: goalDocRef.path,
        operation: 'delete'
    }));
  });
};

// Habits
export const addHabit = (userId: string, habit: Omit<Habit, 'id'>) => {
  const habitsCollectionRef = collection(firestore, 'users', userId, 'habits');
  return addDoc(habitsCollectionRef, habit).catch(async (serverError) => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: habitsCollectionRef.path,
        operation: 'create',
        requestResourceData: habit
    }));
  });
};

export const updateHabit = (userId: string, habitId: string, data: Partial<Habit>) => {
  const habitDocRef = doc(firestore, 'users', userId, 'habits', habitId);
  return updateDoc(habitDocRef, data).catch(async (serverError) => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: habitDocRef.path,
        operation: 'update',
        requestResourceData: data
    }));
  });
};

export const deleteHabit = (userId: string, habitId: string) => {
  const habitDocRef = doc(firestore, 'users', userId, 'habits', habitId);
  return deleteDoc(habitDocRef).catch(async (serverError) => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: habitDocRef.path,
        operation: 'delete'
    }));
  });
};


// Transactions
export const addTransaction = (userId: string, transaction: Omit<Transaction, 'id'>) => {
    const transactionsCollectionRef = collection(firestore, 'users', userId, 'transactions');
    return addDoc(transactionsCollectionRef, transaction).catch(async (serverError) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: transactionsCollectionRef.path,
          operation: 'create',
          requestResourceData: transaction
      }));
    });
};

export const deleteTransaction = (userId: string, transactionId: string) => {
    const transactionDocRef = doc(firestore, 'users', userId, 'transactions', transactionId);
    return deleteDoc(transactionDocRef).catch(async (serverError) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: transactionDocRef.path,
          operation: 'delete'
      }));
    });
};

// Wishlist
export const addWishlistItem = (userId: string, item: Omit<WishlistItem, 'id'>) => {
    const wishlistCollectionRef = collection(firestore, 'users', userId, 'wishlist');
    return addDoc(wishlistCollectionRef, item).catch(async (serverError) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: wishlistCollectionRef.path,
          operation: 'create',
          requestResourceData: item
      }));
    });
};

export const deleteWishlistItem = (userId: string, itemId: string) => {
    const wishlistItemDocRef = doc(firestore, 'users', userId, 'wishlist', itemId);
    return deleteDoc(wishlistItemDocRef).catch(async (serverError) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: wishlistItemDocRef.path,
          operation: 'delete'
      }));
    });
};

// Weekly Plan
export const updateWeeklyPlan = async (userId: string, dayId: string, data: Partial<WeeklyDay>) => {
    const dayDocRef = doc(firestore, `users/${userId}/weeklyPlans/${dayId}`);
    return updateDoc(dayDocRef, data).catch(async (serverError) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: dayDocRef.path,
          operation: 'update',
          requestResourceData: data
      }));
    });
};


// Monthly Strategy
export const updateMonthlyStrategy = async (userId: string, month: string, data: Partial<Omit<MonthlyStrategy, 'id'>>) => {
    const strategyCollectionRef = collection(firestore, 'users', userId, 'monthlyStrategies');
    const q = query(strategyCollectionRef, where('month', '==', month));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        // Create new document if it doesn't exist
        return addDoc(strategyCollectionRef, { month, ...data }).catch(async (serverError) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: strategyCollectionRef.path,
              operation: 'create',
              requestResourceData: { month, ...data }
          }));
        });
    } else {
        // Update existing document
        const docToUpdate = snapshot.docs[0].ref;
        return updateDoc(docToUpdate, data).catch(async (serverError) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: docToUpdate.path,
              operation: 'update',
              requestResourceData: data
          }));
        });
    }
};

// AI Assistant
export const updateAiMessages = (userId: string, messages: any[]) => {
  return updateUserDocument(userId, { aiMessages: messages });
};

export const updateAiNotes = (userId: string, notes: string) => {
  return updateUserDocument(userId, { aiNotes: notes });
};

    
