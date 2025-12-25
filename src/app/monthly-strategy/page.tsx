
"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function MonthlyStrategyPage() {
  const strategySections = [
    { title: "FOCO PRINCIPAL", placeholder: "Escreva aqui..." },
    { title: "GRANDES VITÓRIAS", placeholder: "Escreva aqui..." },
    { title: "APRENDIZADOS", placeholder: "Escreva aqui..." },
  ];

  return (
    <div className="flex flex-col gap-8 h-full">
      <Header />
      <div>
        <h1 className="text-5xl font-bold tracking-tighter font-archivio">
          Estratégia Mensal
        </h1>
        <p className="text-muted-foreground">
          Planeje suas vitórias estratégicas para os próximos 30 dias.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 flex-grow">
        {strategySections.map((section) => (
          <Card key={section.title} className="bg-card-foreground/5 border-none flex flex-col">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-muted-foreground tracking-widest">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <Textarea
                placeholder={section.placeholder}
                className="bg-transparent border-none h-full resize-none text-base focus-visible:ring-0"
              />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <footer className="text-center text-xs text-muted-foreground mt-auto py-4">
        © 2024 PLANNER STUDIES - BUILT FOR PERFORMANCE
      </footer>
    </div>
  );
}
