
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  Trash2,
  BarChart,
} from "lucide-react";
import { addMonths, format, getDaysInMonth, subMonths, startOfWeek, addDays, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/firebase/auth/provider";
import { useHabits, addHabit, updateHabit, deleteHabit } from "@/firebase/firestore/data-hooks";
import type { Habit } from "@/firebase/firestore/data-hooks";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts";


const chartConfig = {
  completion: {
    label: "Conclusão",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function HabitTrackerPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const monthKey = format(currentDate, 'yyyy-MM');
  const isMobile = useIsMobile();

  const { data: monthlyHabits, isLoading } = useHabits(user?.uid, monthKey);
  const [newHabitName, setNewHabitName] = React.useState("");
  
  const [currentWeekStart, setCurrentWeekStart] = React.useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const daysInMonth = Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1);

  const weeklyDays = eachDayOfInterval({
    start: currentWeekStart,
    end: addDays(currentWeekStart, 6),
  });

  const handleAddHabit = () => {
    if (!user?.uid || newHabitName.trim() === "") return;
    addHabit(user.uid, {
      name: newHabitName.trim(),
      month: monthKey,
      completedDays: [],
    });
    setNewHabitName("");
  };

  const handleToggleHabit = (habit: Habit, day: number) => {
    if (!user?.uid) return;
    const completedDays = habit.completedDays.includes(day)
      ? habit.completedDays.filter((d) => d !== day)
      : [...habit.completedDays, day];
    updateHabit(user.uid, habit.id, { completedDays });
  };
  
  const handleDeleteHabit = (habitId: string) => {
    if (!user?.uid) return;
    deleteHabit(user.uid, habitId);
  };
  
  const handlePreviousMonth = () => {
      setCurrentDate(subMonths(currentDate, 1));
  }
  
  const handleNextMonth = () => {
      setCurrentDate(addMonths(currentDate, 1));
  }
  
  const handlePreviousWeek = () => {
    setCurrentWeekStart(subMonths(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addMonths(currentWeekStart, 1));
  };
  
  const displayedDays = isMobile ? weeklyDays.map(d => d.getDate()) : daysInMonth;

  const chartData = React.useMemo(() => {
    if (!monthlyHabits) return [];
    return monthlyHabits.map(habit => ({
        name: habit.name,
        completion: Math.round((habit.completedDays.length / daysInMonth.length) * 100),
    }));
  }, [monthlyHabits, daysInMonth.length]);


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
          <Button variant="outline" size="icon" onClick={isMobile ? handlePreviousWeek : handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm w-36 text-center uppercase">
             {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <Button variant="outline" size="icon" onClick={isMobile ? handleNextWeek : handleNextMonth}>
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
                  {displayedDays.map((day) => (
                    <th key={day} className="text-xs text-muted-foreground font-semibold w-10 text-center py-2">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={displayedDays.length + 1}>Carregando hábitos...</td></tr>
                ) : (monthlyHabits || []).map((habit) => (
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
                      {displayedDays.map((day) => (
                        <td key={day} className="text-center h-10 py-4">
                          <Checkbox
                            className="w-7 h-7 bg-black/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground rounded-md border-none"
                            checked={habit.completedDays.includes(day)}
                            onCheckedChange={() => handleToggleHabit(habit, day)}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td colSpan={displayedDays.length + 1} className="pb-4 pt-0">
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
      
      {(monthlyHabits && monthlyHabits.length > 0) && (
        <Card className="border-none bg-card-foreground/5">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base font-semibold">
                        PERFORMANCE MENSAL
                    </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                    Percentual de conclusão de cada hábito no mês.
                </p>
            </CardHeader>
            <CardContent className="h-80">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <RechartsBarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
                        <XAxis 
                            dataKey="name" 
                            tickLine={false} 
                            axisLine={false}
                            tickMargin={8}
                            interval={0}
                            tickFormatter={(value) => value.slice(0, 10) + (value.length > 10 ? '...' : '')}
                        />
                        <YAxis 
                            tickFormatter={(value) => `${value}%`}
                            tickLine={false} 
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent formatter={(value) => `${value}%`} />}
                        />
                        <Bar 
                            dataKey="completion" 
                            fill="var(--color-completion)" 
                            radius={8} 
                        />
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      )}

      <footer className="text-center text-xs text-muted-foreground mt-auto py-4">
      </footer>
    </div>
  );
}
