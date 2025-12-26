
'use client';

import * as React from 'react';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Check, SlidersHorizontal, Target, Wallet, Calendar, Sparkles, Heart, CircleDashed } from "lucide-react";
import Link from "next/link";
import type { Transaction, MonthlyHabit, Goal, WeeklyDay } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

type AnnualGoalSection = {
  title: string;
  goals: { id: string; text: string; completed: boolean }[];
};


export default function Home() {
  const [activeGoals, setActiveGoals] = React.useState(0);
  const [currentBalance, setCurrentBalance] = React.useState(0);
  const [habitsToday, setHabitsToday] = React.useState({ completed: 0, total: 0 });
  const [nextEvent, setNextEvent] = React.useState("Livre");
  const [coreValues, setCoreValues] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);


  React.useEffect(() => {
    // This function will run on the client, so window is available.
    const calculateOverview = () => {
      // 1. Active Goals
      try {
        const savedGoals = localStorage.getItem("annualGoals");
        if (savedGoals) {
          const parsedGoals: AnnualGoalSection[] = JSON.parse(savedGoals);
          const totalIncomplete = parsedGoals.reduce((acc, section) => {
            return acc + section.goals.filter(goal => !goal.completed).length;
          }, 0);
          setActiveGoals(totalIncomplete);
        }
      } catch (e) { console.error("Failed to parse annual goals", e)}


      // 2. Current Balance
      try {
        const savedTransactions = localStorage.getItem("financialTransactions");
        if (savedTransactions) {
          const transactions: Transaction[] = JSON.parse(savedTransactions);
          const totalGains = transactions.filter(t => t.type === 'entrada').reduce((acc, t) => acc + t.amount, 0);
          const totalExpenses = transactions.filter(t => t.type === 'saida').reduce((acc, t) => acc + t.amount, 0);
          setCurrentBalance(totalGains - totalExpenses);
        }
      } catch(e) { console.error("Failed to parse financial transactions", e)}

      // 3. Habits Today
      try {
        const today = new Date();
        const storageKey = `monthlyHabits_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        const savedHabits = localStorage.getItem(storageKey);
        if (savedHabits) {
          const habits: MonthlyHabit[] = JSON.parse(savedHabits);
          const dayOfMonth = today.getDate();
          const completedCount = habits.filter(h => h.completedDays.includes(dayOfMonth)).length;
          setHabitsToday({ completed: completedCount, total: habits.length });
        }
      } catch(e) { console.error("Failed to parse habits", e)}


      // 4. Next Event
      try {
        const savedWeeklyPlan = localStorage.getItem("weeklyPlan");
        if (savedWeeklyPlan) {
          const weeklyPlan: WeeklyDay[] = JSON.parse(savedWeeklyPlan);
          const today = new Date();
          const dayOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][today.getDay()];
          const todayPlan = weeklyPlan.find(d => d.day === dayOfWeek);
          setNextEvent(todayPlan?.tasks[0]?.name || "Livre");
        }
      } catch (e) { console.error("Failed to parse weekly plan", e)}

      // Core Values
      try {
        const savedValues = localStorage.getItem("coreValues");
        if (savedValues) {
            const parsedValues = JSON.parse(savedValues);
            if (parsedValues && typeof parsedValues === 'string' && parsedValues.trim() !== '') {
                setCoreValues(parsedValues);
            }
        }
      } catch (e) { console.error("Failed to parse core values", e)}
      setIsLoading(false);
    };

    calculateOverview();
    
    // Optional: Re-calculate when storage changes (e.g., in another tab)
    window.addEventListener('storage', calculateOverview);
    
    return () => {
      window.removeEventListener('storage', calculateOverview);
    }

  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  
  const overviewCards = [
    {
      title: "METAS ATIVAS",
      value: activeGoals.toString(),
      icon: Target,
      href: "/annual-goals",
    },
    {
      title: "SALDO ATUAL",
      value: formatCurrency(currentBalance),
      icon: Wallet,
      href: "/financial-management",
    },
    {
      title: "HÁBITOS HOJE",
      value: `${habitsToday.completed}/${habitsToday.total}`,
      icon: Check,
      href: "/habit-tracker",
    },
    {
      title: "PRÓXIMO EVENTO",
      value: nextEvent,
      icon: Calendar,
      href: "/weekly-planning",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <Header />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-lg lg:col-span-2" />
            <Skeleton className="h-64 rounded-lg" />
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Header />
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-bold tracking-tighter font-archivio">
          Clareza gera <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">Poder.</span>
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Sua jornada de 365 dias começa agora. Organize-se com propósito e transforme decisões em sucessos.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="secondary" size="sm"><Link href="/ia-assistant"><Sparkles className="h-4 w-4" /> Assistente IA</Link></Button>
        <Button asChild variant="outline" size="sm"><Link href="/financial-management"><Wallet className="h-4 w-4" /> Finanças</Link></Button>
        <Button asChild variant="outline" size="sm"><Link href="/habit-tracker"><Check className="h-4 w-4" /> Hábitos</Link></Button>
        <Button asChild variant="outline" size="sm"><Link href="/weekly-planning"><SlidersHorizontal className="h-4 w-4" /> Planejamento</Link></Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card) => (
          <Link href={card.href} key={card.title}>
            <Card className="p-6 flex flex-col justify-between group h-full">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-4">
                  <card.icon className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <p className="text-3xl font-bold">{card.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col justify-between group h-full lg:col-span-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Valores Centrais</h3>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <div className="flex items-center gap-4 mt-8">
              {coreValues ? (
                 <p className="text-muted-foreground italic">"{coreValues}"</p>
              ) : (
                <>
                  <CircleDashed className="h-10 w-10 text-muted-foreground/20" />
                  <p className="text-muted-foreground">Defina seus valores na aba Metas do Ano.</p>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <Button asChild variant="secondary" className="w-full"><Link href="/habit-tracker">VERIFICAR HÁBITOS</Link></Button>
              <Button asChild variant="outline" className="w-full"><Link href="/weekly-planning">PLAN SEMANAL</Link></Button>
            </div>
        </Card>
        <Card className="p-8 flex flex-col justify-between items-center bg-primary text-primary-foreground text-center rounded-2xl relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16">
                <div className="w-48 h-48 border-4 border-black/5 rounded-full" />
                <div className="w-32 h-32 border-4 border-black/5 rounded-full absolute top-8 left-8" />
                 <div className="w-16 h-16 border-4 border-black/5 rounded-full absolute top-16 left-16" />
            </div>
          <div className="z-10 flex flex-col h-full">
            <div className="flex-grow">
                <h4 className="font-semibold mb-2">LEMBRETE:</h4>
                <p>A rotina serve à vida, não o contrário.</p>
            </div>
            <Button asChild variant="secondary" className="w-full bg-black text-white hover:bg-black/80"><Link href="/weekly-planning">ACESSAR PLANEJAMENTO</Link></Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
