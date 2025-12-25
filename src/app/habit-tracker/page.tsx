
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
import { monthlyHabits } from "@/lib/data";
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
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

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
            <Input placeholder="Novo hábito..." className="bg-card border-none h-9 w-48" />
            <Button size="icon" className="h-9 w-9 flex-shrink-0">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid gap-y-4" style={{ gridTemplateColumns: `100px repeat(${daysInMonth.length}, 40px)`}}>
              {/* Header */}
              <div className="text-xs text-muted-foreground font-semibold flex items-end">OBJETIVO</div>
              {daysInMonth.map((day) => (
                <div key={day} className="text-xs text-muted-foreground font-semibold flex items-center justify-center">
                  {String(day).padStart(2, "0")}
                </div>
              ))}

              {/* Habits */}
              {monthlyHabits.map((habit) => (
                <React.Fragment key={habit.id}>
                  <div className="flex items-center text-sm font-medium">{habit.name}</div>
                  {daysInMonth.map((day) => (
                    <div key={day} className="flex items-center justify-center">
                      <Checkbox 
                        className="w-7 h-7 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground rounded-md"
                        checked={habit.completedDays.includes(day)}
                      />
                    </div>
                  ))}
                  <div className="col-span-1"></div>
                  <div className="col-span-31 mt-[-10px] mb-2">
                     <Progress value={(habit.completedDays.length / 31) * 100} className="h-2" />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <footer className="text-center text-xs text-muted-foreground mt-auto py-4">
        © 2024 PLANNER STUDIES - BUILT FOR PERFORMANCE
      </footer>
    </div>
  );
}
