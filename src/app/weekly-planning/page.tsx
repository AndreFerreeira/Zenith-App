
"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, X, NotebookPen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/firebase/auth/provider";
import { useWeeklyPlan, useUserDocument, updateWeeklyPlan, updateUserDocument } from '@/firebase/firestore/data-hooks';
import type { WeeklyDay, WeeklyTask, TaskCategory } from "@/firebase/firestore/data-hooks";

const categoryButtons: { label: 'PES' | 'PRO' | 'MAT', category: TaskCategory }[] = [
    { label: 'PES', category: 'PESSOAL' },
    { label: 'PRO', category: 'PROFISSIONAL' },
    { label: 'MAT', category: 'MATERIAL' },
];

export default function WeeklyPlanningPage() {
  const { user } = useAuth();
  const { data: weeklyPlanData, isLoading: isPlanLoading } = useWeeklyPlan(user?.uid);
  const { data: userDoc, isLoading: isDocLoading } = useUserDocument(user?.uid);

  const [weeklyPlan, setWeeklyPlan] = React.useState<WeeklyDay[]>([]);
  const [newTasks, setNewTasks] = React.useState<Record<string, string>>({});
  const [selectedCategories, setSelectedCategories] = React.useState<Record<string, TaskCategory>>({});
  const [quickNotes, setQuickNotes] = React.useState("");

  React.useEffect(() => {
    if (weeklyPlanData) {
      setWeeklyPlan(weeklyPlanData);
    }
    if (userDoc?.quickNotes) {
      setQuickNotes(userDoc.quickNotes);
    }
  }, [weeklyPlanData, userDoc]);

  const handleUpdatePlan = (newPlan: WeeklyDay[]) => {
    if (user?.uid) {
      // We need to update the whole array in firestore
      // Firestore doesn't deep-merge array elements, so we replace the whole field.
      // This is inefficient but necessary for this data structure.
      newPlan.forEach(day => {
        updateWeeklyPlan(user.uid, day.id, { tasks: day.tasks });
      });
    }
  };

  const handleNotesBlur = () => {
    if (user?.uid && userDoc?.quickNotes !== quickNotes) {
      updateUserDocument(user.uid, { quickNotes: quickNotes });
    }
  };

  const handleNewTaskChange = (day: string, value: string) => {
    setNewTasks(prev => ({ ...prev, [day]: value }));
  };

  const handleCategoryChange = (day: string, category: TaskCategory) => {
    setSelectedCategories(prev => ({ ...prev, [day]: category }));
  };

  const handleAddTask = (dayId: string, dayName: string) => {
    const taskName = newTasks[dayName];
    if (!taskName || taskName.trim() === "" || !user?.uid) return;

    const newTask: WeeklyTask = {
      name: taskName.trim(),
      category: selectedCategories[dayName] || 'PESSOAL',
    };

    const newPlan = weeklyPlan.map(d =>
      d.id === dayId ? { ...d, tasks: [...d.tasks, newTask] } : d
    );
    
    setWeeklyPlan(newPlan);
    handleUpdatePlan(newPlan);
    handleNewTaskChange(dayName, "");
  };
  
  const handleRemoveTask = (dayId: string, taskIndex: number) => {
    if (!user?.uid) return;

    const newPlan = weeklyPlan.map(d =>
      d.id === dayId ? { ...d, tasks: d.tasks.filter((_, i) => i !== taskIndex) } : d
    );
    
    setWeeklyPlan(newPlan);
    handleUpdatePlan(newPlan);
  };


  return (
    <div className="flex flex-col gap-8">
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
          <Card key={day.id} className="bg-card-foreground/5 border-none flex flex-col">
            <CardContent className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm">{day.day.toUpperCase()}</h3>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex-grow flex flex-col gap-2">
                {day.tasks.map((task, index) => (
                  <div key={index} className="bg-card p-3 rounded-lg group relative">
                    <p className="text-sm font-medium mb-2">/ {task.name}</p>
                    <Badge variant={
                      task.category === 'PESSOAL' ? 'default' : 
                      task.category === 'PROFISSIONAL' ? 'secondary' : 'outline'
                    } className={
                      task.category === 'PESSOAL' ? 'bg-blue-500/20 text-blue-300 border-none' :
                      task.category === 'PROFISSIONAL' ? 'bg-purple-500/20 text-purple-300 border-none' :
                      'bg-orange-500/20 text-orange-300 border-none'
                    }>
                      {task.category}
                    </Badge>
                     <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto absolute top-1 right-1 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveTask(day.id, index)}>
                        <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {day.tasks.length === 0 && (
                    <div className="flex-grow flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-muted-foreground/5 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-muted-foreground/10" />
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
                            className="text-xs h-7"
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
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTask(day.id, day.day)}
                    />
                    <Button size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => handleAddTask(day.id, day.day)}>
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-card-foreground/5 border-none flex flex-col p-4">
            <div className="flex items-center gap-2 mb-4">
              <NotebookPen className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-muted-foreground">NOTAS RÁPIDAS</h3>
            </div>
            <Textarea 
              placeholder="Pensamentos soltos..."
              className="bg-transparent border-none flex-grow resize-none text-sm focus-visible:ring-0 px-0"
              value={quickNotes}
              onChange={(e) => setQuickNotes(e.target.value)}
              onBlur={handleNotesBlur}
            />
        </Card>
      </div>
    </div>
  );
}
