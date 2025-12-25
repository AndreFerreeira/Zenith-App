
'use client';

import * as React from 'react';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Send, SparklesIcon, User, Plus } from "lucide-react";
import { getAiSuggestions } from '@/app/actions';
import type { SuggestPersonalizedRoutinesInput, SuggestPersonalizedRoutinesOutput } from '@/ai/flows/suggest-personalized-routines';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import type { MonthlyHabit } from '@/lib/data';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';


type Message = {
  role: 'user' | 'assistant';
  content: string | SuggestPersonalizedRoutinesOutput;
};

type Goal = {
  id: string;
  text: string;
  completed: boolean;
};

type GoalSection = {
  title: "Pessoais" | "Profissionais" | "Materiais";
  icon: React.ElementType;
  goals: Goal[];
};


export default function IaAssistantPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [notes, setNotes] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('aiAssistantNotes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error("Failed to parse notes from localStorage", error);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('aiAssistantNotes', JSON.stringify(notes));
  }, [notes]);


  const getContextData = (): SuggestPersonalizedRoutinesInput => {
    let habits: string[] = [];
    let goals: string[] = [];
    let financialData = "Nenhum dado financeiro.";
    let dreamRoutine = "Não definido.";
    let coreValues = "Não definido.";

    try {
      const today = new Date();
      const habitsKey = `monthlyHabits_${format(today, 'yyyy-MM')}`;
      const savedHabits = localStorage.getItem(habitsKey);
      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        habits = parsedHabits.map((h: any) => h.name);
      }

      const savedGoals = localStorage.getItem("annualGoals");
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        parsedGoals.forEach((section: any) => {
          section.goals.forEach((goal: any) => {
            goals.push(goal.text);
          });
        });
      }
      
      const savedRoutine = localStorage.getItem("dreamRoutine");
      if(savedRoutine) dreamRoutine = JSON.parse(savedRoutine);

      const savedValues = localStorage.getItem("coreValues");
      if(savedValues) coreValues = JSON.parse(savedValues);

      const savedTransactions = localStorage.getItem("financialTransactions");
      if (savedTransactions) {
        const transactions = JSON.parse(savedTransactions);
        const totalGains = transactions.filter((t: any) => t.type === 'entrada').reduce((acc: number, t: any) => acc + t.amount, 0);
        const totalExpenses = transactions.filter((t: any) => t.type === 'saida').reduce((acc: number, t: any) => acc + t.amount, 0);
        const balance = totalGains - totalExpenses;
        financialData = `Saldo atual: ${balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
      }
    } catch (e) {
      console.error("Failed to read data from localStorage for AI assistant", e);
    }
    
    return { habits, goals, financialData, dreamRoutine, coreValues };
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const contextData = getContextData();
    const result = await getAiSuggestions(contextData);
    
    if (result.success && result.data) {
        const assistantMessage: Message = { role: 'assistant', content: result.data };
        setMessages(prev => [...prev, assistantMessage]);
    } else {
        const errorMessage: Message = { role: 'assistant', content: "Desculpe, não consegui gerar sugestões. Tente novamente." };
        setMessages(prev => [...prev, errorMessage]);
    }
    setIsLoading(false);
  };
  
  const handleAddGoal = (goalText: string) => {
    try {
      const savedGoals = localStorage.getItem("annualGoals");
      let goalSections: Omit<GoalSection, 'icon'>[] = savedGoals ? JSON.parse(savedGoals) : [
        { title: "Pessoais", goals: [] },
        { title: "Profissionais", goals: [] },
        { title: "Materiais", goals: [] },
      ];

      const personalSection = goalSections.find(s => s.title === "Pessoais");
      
      if (personalSection) {
        const newGoal: Goal = {
          id: Math.random().toString(),
          text: goalText,
          completed: false,
        };
        personalSection.goals.push(newGoal);
      }
      
      localStorage.setItem("annualGoals", JSON.stringify(goalSections));
      toast({ title: "Meta adicionada!", description: `"${goalText}" foi adicionado às suas metas pessoais.` });
    } catch (e) {
      console.error("Failed to add goal to localStorage", e);
      toast({ variant: 'destructive', title: "Erro!", description: "Não foi possível adicionar a meta." });
    }
  };

  const handleAddHabit = (habitName: string) => {
    try {
      const today = new Date();
      const storageKey = `monthlyHabits_${format(today, 'yyyy-MM')}`;
      const savedHabits = localStorage.getItem(storageKey);
      let monthlyHabits: MonthlyHabit[] = savedHabits ? JSON.parse(savedHabits) : [];
      
      const newHabit: MonthlyHabit = {
        id: Math.random().toString(),
        name: habitName,
        completedDays: [],
      };
      
      monthlyHabits.push(newHabit);
      localStorage.setItem(storageKey, JSON.stringify(monthlyHabits));
      toast({ title: "Hábito adicionado!", description: `"${habitName}" foi adicionado ao seu tracker de hábitos.` });
    } catch (e) {
      console.error("Failed to add habit to localStorage", e);
      toast({ variant: 'destructive', title: "Erro!", description: "Não foi possível adicionar o hábito." });
    }
  };

  const renderAssistantMessage = (content: SuggestPersonalizedRoutinesOutput) => {
    return (
      <div className="space-y-4">
        <div>
          <h4 className='font-bold mb-2'>Rotina Diária Sugerida:</h4>
          <p className="text-sm whitespace-pre-wrap">{content.dailyRoutine}</p>
        </div>
        <div>
          <h4 className='font-bold mt-4 mb-2'>Rotina Semanal Sugerida:</h4>
          <p className="text-sm whitespace-pre-wrap">{content.weeklyRoutine}</p>
        </div>

        {content.suggestedGoals && content.suggestedGoals.length > 0 && (
          <div>
            <h4 className='font-bold mt-4 mb-2'>Metas Sugeridas:</h4>
            <div className="space-y-2">
              {content.suggestedGoals.map((goal, i) => (
                <div key={`goal-${i}`} className="flex items-center justify-between bg-card-foreground/10 p-2 rounded-md">
                  <span className="text-sm">{goal}</span>
                  <Button size="sm" variant="ghost" onClick={() => handleAddGoal(goal)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Meta
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.suggestedHabits && content.suggestedHabits.length > 0 && (
          <div>
            <h4 className='font-bold mt-4 mb-2'>Hábitos Sugeridos:</h4>
            <div className="space-y-2">
              {content.suggestedHabits.map((habit, i) => (
                <div key={`habit-${i}`} className="flex items-center justify-between bg-card-foreground/10 p-2 rounded-md">
                  <span className="text-sm">{habit}</span>
                  <Button size="sm" variant="ghost" onClick={() => handleAddHabit(habit)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Hábito
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <Header />
      
      <Tabs defaultValue="chat" className="flex-grow flex flex-col">
        <div className="flex justify-between items-center">
            <div>
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-8 h-8" />
                    <h1 className="text-3xl font-bold tracking-tighter">AI Assistant Hub</h1>
                </div>
                <p className="text-muted-foreground">Peça ajuda para criar rotinas e planejar suas metas.</p>
            </div>
            <TabsList>
                <TabsTrigger value="chat">CHAT</TabsTrigger>
                <TabsTrigger value="notes">NOTAS</TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="chat" className="flex-grow mt-6">
            <Card className="flex-grow bg-card-foreground/5 border-none flex flex-col p-6 h-full">
                <CardContent className="flex-grow flex flex-col gap-4 overflow-y-auto">
                {messages.length === 0 && !isLoading && (
                    <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <BrainCircuit className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground tracking-widest text-sm">INICIE UMA NOVA ESTRATÉGIA</p>
                    <p className='text-sm text-muted-foreground/50 mt-2'>Peça para o AI sugerir uma rotina baseada nos seus dados.</p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                        {message.role === 'assistant' && (
                            <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                <AvatarFallback><SparklesIcon className='w-5 h-5'/></AvatarFallback>
                            </Avatar>
                        )}
                    <div className={`rounded-lg p-3 max-w-2xl w-full ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                        {typeof message.content === 'string' ? (
                          <p className="text-sm">{message.content}</p>
                        ) : (
                          renderAssistantMessage(message.content)
                        )}
                    </div>
                    {message.role === 'user' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><User className='w-5 h-5'/></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                            <AvatarFallback><SparklesIcon className='w-5 h-5 animate-pulse'/></AvatarFallback>
                        </Avatar>
                    <div className="rounded-lg p-3 max-w-lg bg-card animate-pulse w-full">
                        <div className="h-4 bg-muted-foreground/20 rounded w-48 mb-4"></div>
                        <div className="h-4 bg-muted-foreground/20 rounded w-full mb-2"></div>
                        <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                    </div>
                    </div>
                )}

                </CardContent>
                
                <div className="mt-auto">
                <div className="relative">
                    <Input 
                    placeholder="Peça auxílio estratégico ou análise de dados..." 
                    className="bg-card border-none rounded-full h-14 pl-6 pr-16 text-base"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                    />
                    <Button size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary text-primary-foreground" onClick={handleSendMessage} disabled={isLoading}>
                    <Send className="h-5 w-5" />
                    </Button>
                </div>
                </div>
            </Card>
        </TabsContent>
        <TabsContent value="notes" className="flex-grow mt-6">
             <Card className="flex-grow bg-card-foreground/5 border-none flex flex-col p-6 h-full">
                <CardContent className="flex-grow flex flex-col">
                  <Textarea 
                      placeholder="Comece a digitar suas ideias, pensamentos ou qualquer coisa que vier à mente..."
                      className="bg-transparent border-none h-full resize-none text-base focus-visible:ring-0"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                  />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
      <footer className="text-center text-xs text-muted-foreground mt-auto py-4">
        © 2024 PLANNER STUDIES - BUILT FOR PERFORMANCE
      </footer>
    </div>
  );
}
