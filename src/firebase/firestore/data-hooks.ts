
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
  return useDoc<UserDocument>(path, { listen: true });
};

export const useAnnualGoals = (userId?: string) => {
  const path = userId ? `users/${userId}/annualGoals` : null;
  return useCollection<AnnualGoal>(path, { listen: true });
};

export const useHabits = (userId?: string, month?: string) => {
  const path = userId && month ? `users/${userId}/habits` : null;
  const q = path ? query(collection(firestore, path), where('month', '==', month)) : null;
  return useCollection<Habit>(q, { listen: true });
};

export const useTransactions = (userId?: string) => {
  const path = userId ? `users/${userId}/transactions` : null;
  return useCollection<Transaction>(path, { listen: true });
};

export const useWishlist = (userId?: string) => {
  const path = userId ? `users/${userId}/wishlist` : null;
  return useCollection<WishlistItem>(path, { listen: true });
};

export const useWeeklyPlan = (userId?: string) => {
    const path = userId ? `users/${userId}/weeklyPlans` : null;
    return useCollection<WeeklyDay>(path, { listen: true });
};

export const useMonthlyStrategy = (userId?: string, month?: string) => {
    const path = userId && month ? `users/${userId}/monthlyStrategies/${month}` : null;
    const { data, isLoading } = useDoc<MonthlyStrategy>(path, { listen: true });
    return { data, isLoading };
};

export const useAiMessages = (userId?: string) => {
    const { data: userDoc, isLoading } = useUserDocument(userId);
    return { data: userDoc?.aiMessages || [], isLoading };
};

// --- Firestore Write Operations ---

// General document update
export const updateUserDocument = (userId: string, data: Partial<UserDocument>) => {
  const userDocRef = doc(firestore, 'users', userId);
  return updateDoc(userDocRef, data);
};

// Annual Goals
export const addAnnualGoal = (userId: string, goal: Omit<AnnualGoal, 'id'>) => {
  const goalsCollectionRef = collection(firestore, 'users', userId, 'annualGoals');
  return addDoc(goalsCollectionRef, goal);
};

export const updateAnnualGoal = (userId: string, goalId: string, data: Partial<AnnualGoal>) => {
  const goalDocRef = doc(firestore, 'users', userId, 'annualGoals', goalId);
  return updateDoc(goalDocRef, data);
};

export const deleteAnnualGoal = (userId: string, goalId: string) => {
  const goalDocRef = doc(firestore, 'users', userId, 'annualGoals', goalId);
  return deleteDoc(goalDocRef);
};

// Habits
export const addHabit = (userId: string, habit: Omit<Habit, 'id'>) => {
  const habitsCollectionRef = collection(firestore, 'users', userId, 'habits');
  return addDoc(habitsCollectionRef, habit);
};

export const updateHabit = (userId: string, habitId: string, data: Partial<Habit>) => {
  const habitDocRef = doc(firestore, 'users', userId, 'habits', habitId);
  return updateDoc(habitDocRef, data);
};

export const deleteHabit = (userId: string, habitId: string) => {
  const habitDocRef = doc(firestore, 'users', userId, 'habits', habitId);
  return deleteDoc(habitDocRef);
};


// Transactions
export const addTransaction = (userId: string, transaction: Omit<Transaction, 'id'>) => {
    const transactionsCollectionRef = collection(firestore, 'users', userId, 'transactions');
    return addDoc(transactionsCollectionRef, transaction);
};

export const deleteTransaction = (userId: string, transactionId: string) => {
    const transactionDocRef = doc(firestore, 'users', userId, 'transactions', transactionId);
    return deleteDoc(transactionDocRef);
};

// Wishlist
export const addWishlistItem = (userId: string, item: Omit<WishlistItem, 'id'>) => {
    const wishlistCollectionRef = collection(firestore, 'users', userId, 'wishlist');
    return addDoc(wishlistCollectionRef, item);
};

export const deleteWishlistItem = (userId: string, itemId: string) => {
    const wishlistItemDocRef = doc(firestore, 'users', userId, 'wishlist', itemId);
    return deleteDoc(wishlistItemDocRef);
};

// Weekly Plan
export const updateWeeklyPlan = async (userId: string, dayId: string, data: Partial<WeeklyDay>) => {
    const dayDocRef = doc(firestore, `users/${userId}/weeklyPlans/${dayId}`);
    return updateDoc(dayDocRef, data);
};


// Monthly Strategy
export const updateMonthlyStrategy = async (userId: string, month: string, data: Partial<Omit<MonthlyStrategy, 'id' | 'month'>>) => {
    const strategyDocRef = doc(firestore, 'users', userId, 'monthlyStrategies', month);
    // Use setDoc with merge to create or update the document atomically.
    return setDoc(strategyDocRef, { ...data, month }, { merge: true });
};

// AI Assistant
export const updateAiMessages = (userId: string, messages: any[]) => {
  return updateUserDocument(userId, { aiMessages: messages });
};

export const updateAiNotes = (userId: string, notes: string) => {
  return updateUserDocument(userId, { aiNotes: notes });
};

