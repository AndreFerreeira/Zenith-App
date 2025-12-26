
'use client';

import * as React from 'react';
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Briefcase, Box, Plus, Target, Heart, Trash2 } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { AnnualGoal, UserDocument } from '@/firebase/firestore/data';
import { addAnnualGoal, deleteAnnualGoal, updateAnnualGoal, updateUserDocument } from '@/firebase/firestore/data';
import { Skeleton } from '@/components/ui/skeleton';

type Goal = {
  id: string;
  text: string;
  completed: boolean;
  category: "Pessoais" | "Profissionais" | "Materiais";
};

type GoalSection = {
  title: "Pessoais" | "Profissionais" | "Materiais";
  icon: React.ElementType;
  goals: Goal[];
};

export default function AnnualGoalsPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();
  
  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userDoc, isLoading: isUserDocLoading } = useDoc<UserDocument>(userDocRef);

  const goalsCollectionRef = user ? collection(firestore, 'users', user.uid, 'annualGoals') : null;
  const { data: annualGoals, isLoading: areGoalsLoading } = useCollection<AnnualGoal>(goalsCollectionRef);

  const [newGoals, setNewGoals] = React.useState<Record<string, string>>({
    Pessoais: "",
    Profissionais: "",
    Materiais: "",
  });
  
  const [dreamRoutine, setDreamRoutine] = React.useState("");
  const [coreValues, setCoreValues] = React.useState("");

  React.useEffect(() => {
    if (userDoc) {
      setDreamRoutine(userDoc.dreamRoutine || "");
      setCoreValues(userDoc.coreValues || "");
    }
  }, [userDoc]);

  const handleUpdateUserDoc = (field: 'dreamRoutine' | 'coreValues', value: string) => {
    if (user) {
        updateUserDocument(firestore, user.uid, { [field]: value });
    }
  };

  const goalSections: GoalSection[] = React.useMemo(() => {
    const sections: GoalSection[] = [
      { title: "Pessoais", icon: User, goals: [] },
      { title: "Profissionais", icon: Briefcase, goals: [] },
      { title: "Materiais", icon: Box, goals: [] },
    ];

    if (annualGoals) {
      annualGoals.forEach(goal => {
        const section = sections.find(s => s.title === goal.category);
        if (section) {
          section.goals.push(goal as Goal);
        }
      });
    }
    return sections;
  }, [annualGoals]);

  const handleNewGoalChange = (sectionTitle: string, value: string) => {
    setNewGoals(prev => ({ ...prev, [sectionTitle]: value }));
  };

  const handleAddGoal = (sectionTitle: GoalSection['title']) => {
    const goalText = newGoals[sectionTitle];
    if (!goalText || goalText.trim() === "" || !user) return;

    const newGoal: Omit<AnnualGoal, 'id'> = {
      text: goalText.trim(),
      completed: false,
      category: sectionTitle
    };

    addAnnualGoal(firestore, user.uid, newGoal);
    handleNewGoalChange(sectionTitle, "");
  };

  const handleToggleGoal = (goalId: string, completed: boolean) => {
    if (!user) return;
    updateAnnualGoal(firestore, user.uid, goalId, { completed });
  };
  
  const handleRemoveGoal = (goalId: string) => {
    if (!user) return;
    deleteAnnualGoal(firestore, user.uid, goalId);
  };
  
  const isLoading = isUserLoading || areGoalsLoading || isUserDocLoading;

  if (isLoading) {
    return (
        <div className="flex flex-col gap-8 h-full">
            <Header />
            <div>
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-4 w-1/3 mt-2" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
             <div className="grid md:grid-cols-2 gap-6 flex-grow">
                <Skeleton className="h-full" />
                <Skeleton className="h-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 h-full">
      <Header />
      <div>
        <h1 className="text-5xl font-bold tracking-tighter font-archivio">
          Metas do Ano
        </h1>
        <p className="text-muted-foreground">
          A visão estratégica que abastece seu sucesso diário.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {goalSections.map((section) => (
          <Card key={section.title} className="bg-card-foreground/5 border-none flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <section.icon className="h-5 w-5 text-muted-foreground" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow gap-4">
              <div className="flex-grow space-y-3">
                {section.goals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-3 group">
                    <Checkbox id={goal.id} className="w-5 h-5 rounded-full" checked={goal.completed} onCheckedChange={(checked) => handleToggleGoal(goal.id, !!checked)} />
                    <label 
                      htmlFor={goal.id} 
                      className={cn(
                        "text-sm flex-grow",
                        goal.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {goal.text}
                    </label>
                     <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveGoal(goal.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Nova meta..." 
                  className="bg-card border-none h-9" 
                  value={newGoals[section.title]}
                  onChange={(e) => handleNewGoalChange(section.title, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGoal(section.title)}
                />
                <Button size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => handleAddGoal(section.title)}>
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 flex-grow">
          <Card className="bg-card-foreground/5 border-none flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  Rotina dos Sonhos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <Textarea 
                  placeholder="Como seria seu dia perfeito?" 
                  className="bg-transparent border-none h-full resize-none text-base focus-visible:ring-0 px-0" 
                  value={dreamRoutine}
                  onChange={(e) => setDreamRoutine(e.target.value)}
                  onBlur={(e) => handleUpdateUserDoc('dreamRoutine', e.target.value)}
                />
            </CardContent>
          </Card>
          <Card className="bg-card-foreground/5 border-none flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Heart className="h-5 w-5 text-muted-foreground" />
                  Meus Valores
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                 <Textarea 
                  placeholder="Ex: Integridade, Liberdade, Família..." 
                  className="bg-transparent border-none h-full resize-none text-base focus-visible:ring-0 px-0" 
                  value={coreValues}
                  onChange={(e) => setCoreValues(e.target.value)}
                  onBlur={(e) => handleUpdateUserDoc('coreValues', e.target.value)}
                 />
            </CardContent>          
          </Card>
      </div>

      <footer className="text-center text-xs text-muted-foreground mt-auto py-4">
      </footer>
    </div>
  );
}
