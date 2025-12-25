"use client";

import { useState, useMemo } from "react";
import { CheckSquare, CircleHelp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { habits as initialHabits } from "@/lib/data";
import type { Habit } from "@/lib/data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function HabitProgressCircle({ progress }: { progress: number }) {
    const circumference = 2 * Math.PI * 20; // 2 * pi * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative h-16 w-16">
            <svg className="h-full w-full" viewBox="0 0 44 44">
                <circle
                    className="stroke-muted"
                    cx="22"
                    cy="22"
                    r="20"
                    fill="transparent"
                    strokeWidth="3"
                ></circle>
                <circle
                    className="stroke-primary transition-all duration-500"
                    cx="22"
                    cy="22"
                    r="20"
                    fill="transparent"
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 22 22)"
                ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{`${Math.round(progress)}%`}</span>
            </div>
        </div>
    );
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };
  
  const progress = useMemo(() => {
    const completedCount = habits.filter((h) => h.completed).length;
    return habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
  }, [habits]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    Habit Tracker
                </CardTitle>
                <CardDescription>Your daily checklist for success.</CardDescription>
            </div>
            <HabitProgressCircle progress={progress} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted/50">
              <Checkbox
                id={habit.id}
                checked={habit.completed}
                onCheckedChange={() => toggleHabit(habit.id)}
                aria-label={`Mark ${habit.name} as ${habit.completed ? 'incomplete' : 'complete'}`}
              />
              <label
                htmlFor={habit.id}
                className={`flex-1 text-sm font-medium leading-none ${habit.completed ? 'text-muted-foreground line-through' : 'text-foreground'} cursor-pointer`}
              >
                {habit.name}
              </label>
              <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <CircleHelp className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Click to see AI insights for this habit.</p>
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
