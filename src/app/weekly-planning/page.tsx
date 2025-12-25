
"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { weeklyPlan } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, X, NotebookPen } from "lucide-react";

export default function WeeklyPlanningPage() {
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
          <Card key={day.day} className="bg-card-foreground/5 border-none flex flex-col">
            <CardContent className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm">{day.day.toUpperCase()}</h3>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex-grow flex flex-col gap-2">
                {day.tasks.map((task, index) => (
                  <div key={index} className="bg-card p-3 rounded-lg">
                    <p className="text-sm font-medium mb-2">/ {task.name}</p>
                    <Badge variant={
                      task.category === 'PESSOAL' ? 'default' : 
                      task.category === 'PROFISSIONAL' ? 'secondary' : 'outline'
                    } className={
                      task.category === 'PESSOAL' ? 'bg-blue-500/20 text-blue-300 border-none' :
                      task.category === 'PROFISSIONAL' ? 'bg-purple-500/20 text-purple-300 border-none' :
                      'border-dashed'
                    }>
                      {task.category}
                    </Badge>
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
                    <Button variant="outline" size="sm" className="text-xs h-7">PES</Button>
                    <Button variant="outline" size="sm" className="text-xs h-7">PRO</Button>
                    <Button variant="outline" size="sm" className="text-xs h-7">MAT</Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Input placeholder="Novo item..." className="bg-card border-none h-9" />
                    <Button size="icon" className="h-9 w-9 flex-shrink-0">
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-card-foreground/5 border-none flex flex-col items-center justify-center p-4">
            <NotebookPen className="h-8 w-8 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">NOTAS RÁPIDAS</h3>
            <p className="text-xs text-muted-foreground/80">Pensamentos soltos...</p>
        </Card>
      </div>
    </div>
  );
}
