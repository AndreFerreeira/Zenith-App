"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { habits, weeklyGoals, annualGoals } from "@/lib/data";

export default function HabitTrackerPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header />
      <div>
        <h1 className="text-5xl font-bold tracking-tighter font-archivio">
          Habit Tracker
        </h1>
        <p className="text-muted-foreground">
          Build good habits and break bad ones. Track your progress daily.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Daily Habits</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-4 p-4 rounded-lg bg-card-foreground/5">
                <Checkbox id={habit.id} defaultChecked={habit.completed} />
                <label htmlFor={habit.id} className="text-sm font-medium leading-none">
                  {habit.name}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Goals</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {weeklyGoals.map(goal => (
                        <div key={goal.id}>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium">{goal.name}</p>
                                <p className="text-sm text-muted-foreground">{goal.progress}%</p>
                            </div>
                            <Progress value={goal.progress} />
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Annual Goals</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {annualGoals.map(goal => (
                        <div key={goal.id}>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium">{goal.name}</p>
                                <p className="text-sm text-muted-foreground">{goal.progress}%</p>
                            </div>
                            <Progress value={goal.progress} />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
