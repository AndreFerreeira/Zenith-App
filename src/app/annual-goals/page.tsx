
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

type Goal = {
  id: string;
  text: string;
  completed: boolean;
};

type GoalSection = {
  title: "Pessoais" | "Profissionais" | "Materiais";
  icon: React.ElementType;
  goals: Goal[];
};

const initialGoalSections: GoalSection[] = [
  {
    title: "Pessoais",
    icon: User,
    goals: [{ id: 'p1', text: "Meditar 10min por dia", completed: false }],
  },
  {
    title: "Profissionais",
    icon: Briefcase,
    goals: [{ id: 'pro1', text: "Concluir curso de React avançado", completed: false }],
  },
  {
    title: "Materiais",
    icon: Box,
    goals: [{ id: 'mat1', text: "Comprar novo setup ergonômico", completed: false }],
  },
];

export default function AnnualGoalsPage() {
  const [goalSections, setGoalSections] = React.useState<GoalSection[]>(initialGoalSections);
  const [newGoals, setNewGoals] = React.useState<Record<string, string>>({
    Pessoais: "",
    Profissionais: "",
    Materiais: "",
  });
  const [dreamRoutine, setDreamRoutine] = React.useState("");
  const [coreValues, setCoreValues] = React.useState("");

  React.useEffect(() => {
    try {
      const savedGoals = localStorage.getItem("annualGoals");
      const savedRoutine = localStorage.getItem("dreamRoutine");
      const savedValues = localStorage.getItem("coreValues");
      
      if (savedGoals) {
        const parsedGoals: GoalSection[] = JSON.parse(savedGoals);
        // We need to merge the saved goals with the initial sections to keep the icons
        const updatedSections = initialGoalSections.map(section => {
          const savedSection = parsedGoals.find(s => s.title === section.title);
          return savedSection ? { ...section, goals: savedSection.goals } : section;
        });
        setGoalSections(updatedSections);
      } else {
        setGoalSections(initialGoalSections);
      }

      if (savedRoutine) {
        setDreamRoutine(JSON.parse(savedRoutine));
      }
      if (savedValues) {
        setCoreValues(JSON.parse(savedValues));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      setGoalSections(initialGoalSections);
    }
  }, []);

  React.useEffect(() => {
    // Prevent writing initial empty state to localStorage
    if (goalSections.some(s => s.goals.length > initialGoalSections.find(is => is.title === s.title)!.goals.length) || goalSections.some(s => s.goals.some(g => g.completed))) {
       localStorage.setItem("annualGoals", JSON.stringify(goalSections.map(({ icon, ...rest }) => rest)));
    }
  }, [goalSections]);
  
  React.useEffect(() => {
    if (dreamRoutine) {
      localStorage.setItem("dreamRoutine", JSON.stringify(dreamRoutine));
    }
  }, [dreamRoutine]);

  React.useEffect(() => {
    if (coreValues) {
      localStorage.setItem("coreValues", JSON.stringify(coreValues));
    }
  }, [coreValues]);


  const handleNewGoalChange = (sectionTitle: string, value: string) => {
    setNewGoals(prev => ({ ...prev, [sectionTitle]: value }));
  };

  const handleAddGoal = (sectionTitle: GoalSection['title']) => {
    const goalText = newGoals[sectionTitle];
    if (!goalText || goalText.trim() === "") return;

    const newGoal: Goal = {
      id: Math.random().toString(),
      text: goalText.trim(),
      completed: false,
    };

    setGoalSections(prevSections =>
      prevSections.map(section =>
        section.title === sectionTitle
          ? { ...section, goals: [...section.goals, newGoal] }
          : section
      )
    );

    handleNewGoalChange(sectionTitle, "");
  };

  const handleToggleGoal = (sectionTitle: string, goalId: string) => {
    setGoalSections(prevSections =>
      prevSections.map(section =>
        section.title === sectionTitle
          ? {
              ...section,
              goals: section.goals.map(goal =>
                goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
              ),
            }
          : section
      )
    );
  };
  
  const handleRemoveGoal = (sectionTitle: string, goalId: string) => {
    setGoalSections(prevSections =>
      prevSections.map(section =>
        section.title === sectionTitle
          ? {
              ...section,
              goals: section.goals.filter(goal => goal.id !== goalId),
            }
          : section
      )
    );
  };

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
                    <Checkbox id={goal.id} className="w-5 h-5 rounded-full" checked={goal.completed} onCheckedChange={() => handleToggleGoal(section.title, goal.id)} />
                    <label 
                      htmlFor={goal.id} 
                      className={cn(
                        "text-sm flex-grow",
                        goal.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {goal.text}
                    </label>
                     <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveGoal(section.title, goal.id)}>
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
                 />
            </CardContent>
          </Card>
      </div>

      <footer className="text-center text-xs text-muted-foreground mt-auto py-4">
        © 2024 PLANNER STUDIES - BUILT FOR PERFORMANCE
      </footer>
    </div>
  );
}
