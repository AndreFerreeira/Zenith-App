
"use client";

import * as React from 'react';
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/firebase/auth/provider';
import { useMonthlyStrategy, updateMonthlyStrategy } from '@/firebase/firestore/data-hooks';
import { format } from 'date-fns';

type StrategyContent = {
  focus: string;
  wins: string;
  learnings: string;
};

export default function MonthlyStrategyPage() {
  const { user } = useAuth();
  const monthKey = format(new Date(), 'yyyy-MM');
  const { data: strategy, isLoading } = useMonthlyStrategy(user?.uid, monthKey);

  const [content, setContent] = React.useState<StrategyContent>({
    focus: "",
    wins: "",
    learnings: "",
  });

  React.useEffect(() => {
    if (strategy) {
      setContent({
        focus: strategy.focus || "",
        wins: strategy.wins || "",
        learnings: strategy.learnings || "",
      });
    }
  }, [strategy]);

  const handleContentChange = (field: keyof StrategyContent, value: string) => {
    const newContent = { ...content, [field]: value };
    setContent(newContent);
    if (user?.uid) {
      updateMonthlyStrategy(user.uid, monthKey, newContent);
    }
  };

  const strategySections = [
    { title: "FOCO PRINCIPAL", field: "focus", placeholder: "Escreva aqui...", value: content.focus },
    { title: "GRANDES VITÓRIAS", field: "wins", placeholder: "Escreva aqui...", value: content.wins },
    { title: "APRENDIZADOS", field: "learnings", placeholder: "Escreva aqui...", value: content.learnings },
  ] as const;

  if (isLoading) {
    return <div>Carregando estratégia...</div>;
  }

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
      </footer>
    </div>
  );
}
