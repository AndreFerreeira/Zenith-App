
"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, X, NotebookPen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/firebase/auth/provider';
import { useWeeklyPlan, useUserDocument, updateWeeklyPlan, updateUserDocument } from '@/firebase/firestore/data-hooks';
import type { WeeklyDay, WeeklyTask, TaskCategory } from "@/firebase/firestore/data-hooks";
import { Skeleton } from "@/components/ui/skeleton";

const categoryButtons: { label: 'PES' | 'PRO' | 'MAT', category: TaskCategory }[] = [
    { label: 'PES', category: 'PESSOAL' },
    { label: 'PRO', category: 'PROFISSIONAL' },
    { label: 'MAT', category: 'MATERIAL' },
];

const noteBlockDays = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

export default function WeeklyPlanningPage() {
  const { user } = useAuth();
  const { data: weeklyPlanData, isLoading: isPlanLoading } = useWeeklyPlan(user?.uid);
  const { data: userDoc, isLoading: isDocLoading } = useUserDocument(user?.uid);

  const [weeklyPlan, setWeeklyPlan] = React.useState<WeeklyDay[]>([]);
  const [newTasks, setNewTasks] = React.useState<Record<string, string>>({});
  const [selectedCategories, setSelectedCategories] = React.useState<Record<string, TaskCategory>>({});
  const [quickNotes, setQuickNotes] = React.useState("");
  const [weeklyNotesBlocks, setWeeklyNotesBlocks] = React.useState<string[]>([]);
  
  const weeklyPlanJson = JSON.stringify(weeklyPlanData);
  const userDocJson = JSON.stringify(userDoc);

  React.useEffect(() => {
    if (weeklyPlanData) {
      const dayOrder = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
      const sortedPlan = [...weeklyPlanData].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
      setWeeklyPlan(sortedPlan);
    }
  }, [weeklyPlanJson]);

  React.useEffect(() => {
    if (userDoc) {
      setQuickNotes(userDoc.quickNotes || "");
      setWeeklyNotesBlocks(userDoc.weeklyNotesBlocks || Array(7).fill(""));
    }
  }, [userDocJson]);

  const handleUpdatePlan = (dayId: string, newTasks: WeeklyTask[]) => {
    if (user?.uid) {
      updateWeeklyPlan(user.uid, dayId, { tasks: newTasks });
    }
  };
  
  const handleNotesBlur = () => {
    if (user?.uid && userDoc?.quickNotes !== quickNotes) {
      updateUserDocument(user.uid, { quickNotes: quickNotes });
    }
  };

  const handleWeeklyNoteChange = (index: number, value: string) => {
    const newNotes = [...weeklyNotesBlocks];
    newNotes[index] = value;
    setWeeklyNotesBlocks(newNotes);
  };

  const handleWeeklyNoteBlur = (index: number) => {
    if (user?.uid && userDoc?.weeklyNotesBlocks?.[index] !== weeklyNotesBlocks[index]) {
       updateUserDocument(user.uid, { weeklyNotesBlocks: weeklyNotesBlocks });
    }
  };

  const handleNewTaskChange = (day: string, value: string) => {
    setNewTasks(prev => ({ ...prev, [day]: value }));
  };

  const handleCategoryChange = (day: string, category: TaskCategory) => {
    setSelectedCategories(prev => ({ ...prev, [day]: category }));
  };

  const handleAddTask = (day: WeeklyDay) => {
    const taskName = newTasks[day.day];
    if (!taskName || taskName.trim() === "" || !user?.uid) return;

    const newTask: WeeklyTask = {
      name: taskName.trim(),
      category: selectedCategories[day.day] || 'PESSOAL',
    };

    const updatedTasks = [...day.tasks, newTask];
    handleUpdatePlan(day.id, updatedTasks);
    handleNewTaskChange(day.day, "");
  };
  
  const handleRemoveTask = (day: WeeklyDay, taskIndex: number) => {
    if (!user?.uid) return;

    const updatedTasks = day.tasks.filter((_, i) => i !== taskIndex);
    handleUpdatePlan(day.id, updatedTasks);
  };
  
  const isLoading = isPlanLoading || isDocLoading;

  if (isLoading) {
    return (
        <div className="flex flex-col gap-8 h-full">
            <Header />
            <div>
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-80" />)}
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 h-full">
      <Header />
      <div>
        <h1 className="text-5xl font-bold tracking-tighter font-archivio">
          Visão Semanal
        </h1>
        <p className="text-muted-foreground">
          Conecte cada tarefa ao seu propósito maior.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {weeklyPlan.map((day) => (
          <Card key={day.id} className="bg-card-foreground/5 border-none flex flex-col min-h-[320px]">
            <CardContent className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm">{day.day.toUpperCase()}</h3>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex-grow flex flex-col gap-2">
                {day.tasks.length > 0 ? day.tasks.map((task, index) => (
                  <div key={index} className="bg-card p-3 rounded-lg group relative">
                    <p className="text-sm font-medium pr-6">/ {task.name}</p>
                    <Badge variant={
                      task.category === 'PESSOAL' ? 'default' : 
                      task.category === 'PROFISSIONAL' ? 'secondary' : 'outline'
                    } className={`mt-2 border-none text-xs ${
                      task.category === 'PESSOAL' ? 'bg-blue-500/20 text-blue-300' :
                      task.category === 'PROFISSIONAL' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-orange-500/20 text-orange-300'
                    }`}>
                      {task.category}
                    </Badge>
                     <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto absolute top-1 right-1 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveTask(day, index)}>
                        <X className="h-4 w-4" />
                    </Button>
                  </div>
                )) : (
                    <div className="flex-grow flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-muted-foreground/5 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                               <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
                            </div>
                        </div>
                    </div>
                )}
              </div>
              
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                    {categoryButtons.map(catBtn => (
                         <Button 
                            key={catBtn.label}
                            variant={(selectedCategories[day.day] || 'PESSOAL') === catBtn.category ? 'secondary' : 'outline'} 
                            size="sm" 
                            className="text-xs h-7 px-2"
                            onClick={() => handleCategoryChange(day.day, catBtn.category)}
                         >
                            {catBtn.label}
                        </Button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Novo item..." 
                      className="bg-card border-none h-9"
                      value={newTasks[day.day] || ""}
                      onChange={(e) => handleNewTaskChange(day.day, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTask(day)}
                    />
                    <Button size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => handleAddTask(day)}>
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-card-foreground/5 border-none flex flex-col p-4 min-h-[320px]">
            <div className="flex flex-col flex-grow text-center">
                <div className="flex-grow flex flex-col items-center justify-center">
                    <NotebookPen className="h-8 w-8 text-muted-foreground/30 mb-4" />
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">NOTAS RÁPIDAS</h3>
                    <p className="text-xs text-muted-foreground/60">Pensamentos soltos...</p>
                </div>
                <Textarea 
                placeholder="Digite aqui..."
                className="bg-transparent border-none flex-grow resize-none text-sm focus-visible:ring-0 px-0 text-center"
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                onBlur={handleNotesBlur}
                />
            </div>
        </Card>

        {weeklyNotesBlocks.map((note, index) => (
            <Card key={`note-block-${index}`} className="bg-card-foreground/5 border-none flex flex-col p-4 min-h-[320px]">
                <div className="flex flex-col flex-grow text-center">
                    <div className="flex-grow flex flex-col items-center justify-center">
                        <NotebookPen className="h-8 w-8 text-muted-foreground/30 mb-4" />
                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">{noteBlockDays[index].toUpperCase()}</h3>
                    </div>
                    <Textarea
                        placeholder="Digite aqui..."
                        className="bg-transparent border-none flex-grow resize-none text-sm focus-visible:ring-0 px-0 text-center"
                        value={note}
                        onChange={(e) => handleWeeklyNoteChange(index, e.target.value)}
                        onBlur={() => handleWeeklyNoteBlur(index)}
                    />
                </div>
            </Card>
        ))}
        
      </div>
    </div>
  );
}
