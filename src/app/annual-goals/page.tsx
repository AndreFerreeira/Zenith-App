
'use client';

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Briefcase, Box, Plus, Target, Heart } from "lucide-react";

const goalSections = [
  {
    title: "Pessoais",
    icon: User,
    goals: ["Meditar 10min por dia"],
  },
  {
    title: "Profissionais",
    icon: Briefcase,
    goals: ["Concluir curso de React avançado"],
  },
  {
    title: "Materiais",
    icon: Box,
    goals: ["Comprar novo setup ergonômico"],
  },
];

export default function AnnualGoalsPage() {
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
                  <div key={goal} className="flex items-center gap-3">
                    <Checkbox id={goal} className="w-5 h-5 rounded-full" />
                    <label htmlFor={goal} className="text-sm">{goal}</label>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Nova meta..." className="bg-card border-none h-9" />
                <Button size="icon" className="h-9 w-9 flex-shrink-0">
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
                <Input placeholder="Como seria seu dia perfeito?" className="bg-transparent border-none h-full resize-none text-base focus-visible:ring-0 px-0" />
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
                 <Input placeholder="Ex: Integridade, Liberdade, Família..." className="bg-transparent border-none h-full resize-none text-base focus-visible:ring-0 px-0" />
            </CardContent>
          </Card>
      </div>

      <footer className="text-center text-xs text-muted-foreground mt-auto py-4">
        © 2024 PLANNER STUDIES - BUILT FOR PERFORMANCE
      </footer>
    </div>
  );
}
