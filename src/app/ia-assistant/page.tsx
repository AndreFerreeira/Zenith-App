
'use client';

import * as React from 'react';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Send, SparklesIcon, User, Plus, Trash2 } from "lucide-react";
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
      const savedMessages = localStorage.getItem('aiAssistantMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  React.useEffect(() => {
    if (notes) {
      localStorage.setItem('aiAssistantNotes', JSON.stringify(notes));
    }
  }, [notes]);

  React.useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('aiAssistantMessages', JSON.stringify(messages));
    } else {
      // Clear from storage if messages array is empty
      localStorage.removeItem('aiAssistantMessages');
    }
  }, [messages]);


  const getContextData = (theme: string): SuggestPersonalizedRoutinesInput => {
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
    
    return { theme, habits, goals, financialData, dreamRoutine, coreValues };
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const contextData = getContextData(currentInput);
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
    if (!goalText || goalText.trim() === "") return;
    try {
      const savedGoals = localStorage.getItem("annualGoals");
      let goalSections: Omit<GoalSection, 'icon'>[] = savedGoals ? JSON.parse(savedGoals) : [
        { title: "Pessoais", goals: [] },
        { title: "Profissionais", goals: [] },
        { title: "Materiais", goals: [] },
      ];

      const personalSection = goalSections.find(s => s.title === "Pessoais") || { title: "Pessoais", goals: []};
      if (!goalSections.find(s => s.title === "Pessoais")) {
        goalSections.push(personalSection);
      }
      
      const newGoal: Goal = {
        id: Math.random().toString(),
        text: goalText,
        completed: false,
      };
      personalSection.goals.push(newGoal);
      
      localStorage.setItem("annualGoals", JSON.stringify(goalSections));
      toast({ title: "Meta adicionada!", description: `"${goalText}" foi adicionado às suas metas pessoais.` });
    } catch (e) {
      console.error("Failed to add goal to localStorage", e);
      toast({ variant: 'destructive', title: "Erro!", description: "Não foi possível adicionar a meta." });
    }
  };

  const handleAddHabit = (habitName: string) => {
    if (!habitName || habitName.trim() === "") return;
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

  const handleClearHistory = () => {
    setMessages([]);
    toast({ title: "Histórico limpo!", description: "Sua conversa com o assistente foi apagada." });
  };

  const AssistantMessage = ({ content }: { content: SuggestPersonalizedRoutinesOutput }) => {
    const [editableGoals, setEditableGoals] = React.useState(content.suggestedGoals || []);
    const [editableHabits, setEditableHabits] = React.useState(content.suggestedHabits || []);
  
    const handleGoalChange = (index: number, value: string) => {
      const newGoals = [...editableGoals];
      newGoals[index] = value;
      setEditableGoals(newGoals);
    };
  
    const handleHabitChange = (index: number, value: string) => {
      const newHabits = [...editableHabits];
      newHabits[index] = value;
      setEditableHabits(newHabits);
    };
  
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
  
        {editableGoals.length > 0 && (
          <div>
            <h4 className='font-bold mt-4 mb-2'>Metas Sugeridas:</h4>
            <div className="space-y-2">
              {editableGoals.map((goal, i) => (
                <div key={`goal-${i}`} className="flex items-center gap-2">
                  <Input 
                    value={goal}
                    onChange={(e) => handleGoalChange(i, e.target.value)}
                    className="bg-card-foreground/10 border-none h-9"
                  />
                  <Button size="icon" className="h-9 w-9 flex-shrink-0" variant="secondary" onClick={() => handleAddGoal(goal)}>
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
  
        {editableHabits.length > 0 && (
          <div>
            <h4 className='font-bold mt-4 mb-2'>Hábitos Sugeridos:</h4>
            <div className="space-y-2">
              {editableHabits.map((habit, i) => (
                <div key={`habit-${i}`} className="flex items-center gap-2">
                   <Input 
                    value={habit}
                    onChange={(e) => handleHabitChange(i, e.target.value)}
                    className="bg-card-foreground/10 border-none h-9"
                  />
                  <Button size="icon" className="h-9 w-9 flex-shrink-0" variant="secondary" onClick={() => handleAddHabit(habit)}>
                    <Plus className="h-5 w-5" />
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
            <Card className="flex-grow bg-card-foreground/5 border-none flex flex-col h-full">
                <div className="p-6 relative flex-grow flex flex-col">
                    {messages.length > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={handleClearHistory}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Limpar histórico</span>
                        </Button>
                    )}
                    <CardContent className="flex-grow flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-28rem)]">
                    {messages.length === 0 && !isLoading && (
                        <div className="flex-grow flex flex-col items-center justify-center text-center h-full">
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
                            <AssistantMessage content={message.content} />
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
                
                    <div className="mt-auto pt-4">
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
                </div>
            </Card>
        </TabsContent>
        <TabsContent value="notes" className="flex-grow mt-6">
             <Card className="flex-grow bg-card-foreground/5 border-none flex flex-col p-6 h-full">
                <CardContent className="flex-grow flex flex-col">
                  <Textarea 
                      placeholder="Comece a digitar suas ideias, pensamentos ou qualquer coisa que vier à mente..."
                      className="bg-transparent border-none h-full resize-none text-base focus-visible:ring-0 px-0"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                  />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
      <footer className="text-center text-xs text-muted-foreground mt-auto py-4">
      </footer>
    </div>
  );
}
