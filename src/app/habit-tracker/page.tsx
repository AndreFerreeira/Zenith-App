
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
import type { MonthlyHabit } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  Trash2,
} from "lucide-react";
import { addMonths, format, getDaysInMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

const initialMonthlyHabits: MonthlyHabit[] = [
    {
        id: 'mh1',
        name: 'TESTE',
        completedDays: [1, 2, 4, 5, 8, 9, 10, 11, 12, 15, 18, 20, 22, 25, 28, 29, 30]
    },
    {
        id: 'mh2',
        name: 'LEITURA',
        completedDays: [3, 6, 7, 13, 14, 16, 17, 19, 21, 23, 24, 26, 27, 31]
    }
]

export default function HabitTrackerPage() {
  const [monthlyHabits, setMonthlyHabits] = React.useState<MonthlyHabit[]>([]);
  const [newHabitName, setNewHabitName] = React.useState("");
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const getStorageKey = (date: Date) => {
    return `monthlyHabits_${format(date, 'yyyy-MM')}`;
  }

  React.useEffect(() => {
    try {
      const savedHabits = localStorage.getItem(getStorageKey(currentDate));
      if (savedHabits) {
        setMonthlyHabits(JSON.parse(savedHabits));
      } else {
        if (format(currentDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM')) {
            setMonthlyHabits(initialMonthlyHabits.map(habit => ({ ...habit, id: habit.id || Math.random().toString() })));
        } else {
            setMonthlyHabits([]);
        }
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      setMonthlyHabits(initialMonthlyHabits.map(habit => ({ ...habit, id: habit.id || Math.random().toString() })));
    }
  }, [currentDate]);

  React.useEffect(() => {
    if (monthlyHabits.length > 0) {
      localStorage.setItem(getStorageKey(currentDate), JSON.stringify(monthlyHabits));
    }
  }, [monthlyHabits, currentDate]);

  const daysInMonth = Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1);

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
  
  const handleDeleteHabit = (habitId: string) => {
    setMonthlyHabits(monthlyHabits.filter(habit => habit.id !== habitId));
  };
  
  const handlePreviousMonth = () => {
      setCurrentDate(subMonths(currentDate, 1));
  }
  
  const handleNextMonth = () => {
      setCurrentDate(addMonths(currentDate, 1));
  }


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
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm w-36 text-center uppercase">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
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
                      <td className="py-4 text-sm font-medium h-10">
                        <div className="relative group flex items-center">
                          <span>{habit.name}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto absolute right-0 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteHabit(habit.id)}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
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
                        <Progress value={(habit.completedDays.length / daysInMonth.length) * 100} className="h-2" />
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
