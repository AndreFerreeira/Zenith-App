
'use client';

import { useState, useEffect, useCallback } from 'react';

type Goal = {
  id: string;
  text: string;
  completed: boolean;
};

type GoalSection = {
  title: "Pessoais" | "Profissionais" | "Materiais";
  goals: Goal[];
};

export function useAnnualGoalsProgress() {
  const [progress, setProgress] = useState(0);

  const calculateProgress = useCallback(() => {
    try {
      const savedGoals = localStorage.getItem("annualGoals");
      if (savedGoals) {
        const parsedGoals: GoalSection[] = JSON.parse(savedGoals);
        const allGoals = parsedGoals.flatMap(section => section.goals);
        
        if (allGoals.length === 0) {
          setProgress(0);
          return;
        }

        const completedGoals = allGoals.filter(goal => goal.completed).length;
        const newProgress = (completedGoals / allGoals.length) * 100;
        setProgress(newProgress);
      } else {
        setProgress(0);
      }
    } catch (error) {
      console.error("Failed to calculate annual goals progress:", error);
      setProgress(0);
    }
  }, []);

  useEffect(() => {
    calculateProgress();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'annualGoals') {
        calculateProgress();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [calculateProgress]);

  return { progress };
}
