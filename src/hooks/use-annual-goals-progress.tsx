
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/firebase/auth/provider';
import { useAnnualGoals } from '@/firebase/firestore/data-hooks';

export function useAnnualGoalsProgress() {
  const { user } = useAuth();
  const { data: goals } = useAnnualGoals(user?.uid);

  const progress = useMemo(() => {
    if (!goals || goals.length === 0) {
      return 0;
    }
    const completedGoals = goals.filter(goal => goal.completed).length;
    return (completedGoals / goals.length) * 100;
  }, [goals]);

  return { progress };
}
