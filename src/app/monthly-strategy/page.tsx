
"use client";

import * as React from 'react';
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type StrategyContent = {
  focus: string;
  wins: string;
  learnings: string;
};

export default function MonthlyStrategyPage() {
  const [content, setContent] = React.useState<StrategyContent>({
    focus: "",
    wins: "",
    learnings: "",
  });

  React.useEffect(() => {
    try {
      const savedContent = localStorage.getItem("monthlyStrategy");
      if (savedContent) {
        setContent(JSON.parse(savedContent));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  React.useEffect(() => {
    // This effect runs only when `content` changes, but not on the initial load.
    // A check to prevent overwriting localStorage with initial empty state.
    if (content.focus || content.wins || content.learnings) {
        localStorage.setItem("monthlyStrategy", JSON.stringify(content));
    }
  }, [content]);

  const handleContentChange = (field: keyof StrategyContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const strategySections = [
    { title: "FOCO PRINCIPAL", field: "focus", placeholder: "Escreva aqui...", value: content.focus },
    { title: "GRANDES VITÓRIAS", field: "wins", placeholder: "Escreva aqui...", value: content.wins },
    { title: "APRENDIZADOS", field: "learnings", placeholder: "Escreva aqui...", value: content.learnings },
  ] as const;

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
                value={section.value}
                onChange={(e) => handleContentChange(section.field, e.target.value)}
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
