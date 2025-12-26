
'use client';

import * as React from 'react';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Check, SlidersHorizontal, Target, Wallet, Calendar, Sparkles, Heart, CircleDashed } from "lucide-react";
import Link from "next/link";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/firebase/auth/provider';
import { useWeeklyPlan, useUserDocument, useAnnualGoals, useTransactions, useHabits } from '@/firebase/firestore/data-hooks';
import { format, parseISO } from 'date-fns';

// --- Componentes de Card Individuais ---

const ActiveGoalsCard = () => {
  const { user } = useAuth();
  const { data: goals, isLoading } = useAnnualGoals(user?.uid);
  const value = React.useMemo(() => goals?.filter(goal => !goal.completed).length.toString() || '0', [goals]);

  return (
    <OverviewCard title="METAS ATIVAS" value={value} icon={Target} href="/annual-goals" isLoading={isLoading} />
  );
};

const CurrentBalanceCard = () => {
  const { user } = useAuth();
  const { data: transactions, isLoading } = useTransactions(user?.uid);
  const value = React.useMemo(() => {
    if (!transactions) return formatCurrency(0);
    const parsedTransactions = transactions.map(t => ({...t, date: parseISO(t.date)}));
    const totalGains = parsedTransactions.filter(t => t.type === 'entrada').reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = parsedTransactions.filter(t => t.type === 'saida').reduce((acc, t) => acc + t.amount, 0);
    return formatCurrency(totalGains - totalExpenses);
  }, [transactions]);
  
  return <OverviewCard title="SALDO ATUAL" value={value} icon={Wallet} href="/financial-management" isLoading={isLoading} />;
};

const HabitsTodayCard = () => {
  const { user } = useAuth();
  const today = new Date();
  const habitsKey = format(today, 'yyyy-MM');
  const { data: habits, isLoading } = useHabits(user?.uid, habitsKey);
  const value = React.useMemo(() => {
    if (!habits) return "0/0";
    const dayOfMonth = today.getDate();
    const completedCount = habits.filter(h => h.completedDays.includes(dayOfMonth)).length;
    return `${completedCount}/${habits.length}`;
  }, [habits, today]);

  return <OverviewCard title="HÁBITOS HOJE" value={value} icon={Check} href="/habit-tracker" isLoading={isLoading} />;
};

const NextEventCard = () => {
  const { user } = useAuth();
  const today = new Date();
  const dayOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][today.getDay()];
  const { data: weeklyPlan, isLoading } = useWeeklyPlan(user?.uid);
  const value = React.useMemo(() => {
    if (!weeklyPlan) return "Livre";
    const todayPlan = weeklyPlan.find(d => d.day === dayOfWeek);
    return todayPlan?.tasks[0]?.name || "Livre";
  }, [weeklyPlan, dayOfWeek]);
  
  return <OverviewCard title="PRÓXIMO EVENTO" value={value} icon={Calendar} href="/weekly-planning" isLoading={isLoading} />;
};

// --- Componente Genérico de Card ---

type OverviewCardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
  href: string;
  isLoading: boolean;
};

const OverviewCard = ({ title, value, icon: Icon, href, isLoading }: OverviewCardProps) => (
  <Link href={href}>
    <Card className="p-6 flex flex-col justify-between group h-full">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      {isLoading ? <Skeleton className="h-9 w-3/4 mt-1" /> : <p className="text-3xl font-bold">{value}</p>}
    </Card>
  </Link>
);


// --- Funções Utilitárias ---
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// --- Componente Principal ---

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: userDoc, isLoading: isUserDocLoading } = useUserDocument(user?.uid);

  if (isAuthLoading) {
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
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
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
        <ActiveGoalsCard />
        <CurrentBalanceCard />
        <HabitsTodayCard />
        <NextEventCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col justify-between group h-full lg:col-span-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Valores Centrais</h3>
              </div>
               <Link href="/annual-goals">
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
               </Link>
            </div>
            <div className="flex items-center gap-4 mt-8">
              {isUserDocLoading ? <Skeleton className="h-6 w-full" /> : (userDoc?.coreValues ? (
                 <p className="text-muted-foreground italic">"{userDoc.coreValues}"</p>
              ) : (
                <>
                  <CircleDashed className="h-10 w-10 text-muted-foreground/20" />
                  <p className="text-muted-foreground">Defina seus valores na aba Metas do Ano.</p>
                </>
              ))}
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
