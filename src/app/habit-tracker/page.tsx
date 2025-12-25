
"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { monthlyHabits as initialMonthlyHabits } from "@/lib/data";
import type { MonthlyHabit } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
} from "lucide-react";

export default function HabitTrackerPage() {
  const [monthlyHabits, setMonthlyHabits] = React.useState<MonthlyHabit[]>(
    initialMonthlyHabits.map(habit => ({ ...habit, id: habit.id || Math.random().toString() }))
  );
  const [newHabitName, setNewHabitName] = React.useState("");

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleAddHabit = () => {
    if (newHabitName.trim() === "") return;
    const newHabit: MonthlyHabit = {
      id: Math.random().toString(),
      name: newHabitName,
      completedDays: [],
    };
    setMonthlyHabits([...monthlyHabits, newHabit]);
    setNewHabitName("");
  };

  const handleToggleHabit = (habitId: string, day: number) => {
    setMonthlyHabits(
      monthlyHabits.map((habit) => {
        if (habit.id === habitId) {
          const completedDays = habit.completedDays.includes(day)
            ? habit.completedDays.filter((d) => d !== day)
            : [...habit.completedDays, day];
          return { ...habit, completedDays };
        }
        return habit;
      })
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <Header />
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-5xl font-bold tracking-tighter font-archivio">
              Habit Tracker
            </h1>
            <Badge variant="outline">MENSAL</Badge>
          </div>
          <p className="text-muted-foreground">
            Os dados são exclusivos para o mês selecionado.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm">DEZEMBRO</span>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-none bg-card-foreground/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">
              REGISTRO DIÁRIO
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Novo hábito..."
              className="bg-card border-none h-9 w-48"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
            />
            <Button size="icon" className="h-9 w-9 flex-shrink-0" onClick={handleAddHabit}>
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="w-40 text-left text-xs text-muted-foreground font-semibold py-2">OBJETIVO</th>
                  {daysInMonth.map((day) => (
                    <th key={day} className="text-xs text-muted-foreground font-semibold w-10 text-center py-2">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthlyHabits.map((habit) => (
                  <React.Fragment key={habit.id}>
                    <tr>
                      <td className="py-4 text-sm font-medium h-10">{habit.name}</td>
                      {daysInMonth.map((day) => (
                        <td key={day} className="text-center h-10 py-4">
                          <Checkbox
                            className="w-7 h-7 bg-black/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground rounded-md border-none"
                            checked={habit.completedDays.includes(day)}
                            onCheckedChange={() => handleToggleHabit(habit.id, day)}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td colSpan={daysInMonth.length + 1} className="pb-4 pt-0">
                        <Progress value={(habit.completedDays.length / 31) * 100} className="h-2" />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <footer className="text-center text-xs text-muted-foreground mt-auto py-4">
        © 2024 PLANNER STUDIES - BUILT FOR PERFORMANCE
      </footer>
    </div>
  );
}
