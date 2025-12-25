'use client';

import * as React from 'react';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Send, SparklesIcon, User } from "lucide-react";
import { getAiSuggestions } from '@/app/actions';
import type { SuggestPersonalizedRoutinesInput, SuggestPersonalizedRoutinesOutput } from '@/ai/flows/suggest-personalized-routines';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Message = {
  role: 'user' | 'assistant';
  content: string | SuggestPersonalizedRoutinesOutput;
};

export default function IaAssistantPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const getContextData = (): SuggestPersonalizedRoutinesInput => {
    let habits: string[] = [];
    let goals: string[] = [];
    let financialData = "Nenhum dado financeiro.";

    try {
      // Habits
      const today = new Date();
      const habitsKey = `monthlyHabits_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      const savedHabits = localStorage.getItem(habitsKey);
      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        habits = parsedHabits.map((h: any) => h.name);
      }

      // Goals
      const savedGoals = localStorage.getItem("annualGoals");
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        parsedGoals.forEach((section: any) => {
          section.goals.forEach((goal: any) => {
            goals.push(goal.text);
          });
        });
      }

      // Financials
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
    
    return { habits, goals, financialData };
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
  

  return (
    <div className="flex flex-col gap-8 h-full">
      <Header />
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-tighter">AI Assistant</h1>
          </div>
          <p className="text-muted-foreground">Peça ao AI para analisar seus dados e sugerir rotinas.</p>
        </div>
      </div>
      
      <Card className="flex-grow bg-card-foreground/5 border-none flex flex-col p-6">
        <CardContent className="flex-grow flex flex-col gap-4 overflow-y-auto">
          {messages.length === 0 && !isLoading && (
             <div className="flex-grow flex flex-col items-center justify-center text-center">
              <BrainCircuit className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground tracking-widest text-sm">SUGERIR ROTINA OTIMIZADA</p>
              <p className='text-sm text-muted-foreground/50 mt-2'>O assistente irá analisar suas metas, hábitos e finanças para criar um plano.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                        <AvatarFallback><SparklesIcon className='w-5 h-5'/></AvatarFallback>
                    </Avatar>
                )}
              <div className={`rounded-lg p-3 max-w-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                {typeof message.content === 'string' ? (
                  <p className="text-sm">{message.content}</p>
                ) : (
                  <div>
                    <h4 className='font-bold mb-2'>Rotina Diária Sugerida:</h4>
                    <p className="text-sm whitespace-pre-wrap">{message.content.dailyRoutine}</p>
                    <h4 className='font-bold mt-4 mb-2'>Rotina Semanal Sugerida:</h4>
                    <p className="text-sm whitespace-pre-wrap">{message.content.weeklyRoutine}</p>
                  </div>
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
              <div className="rounded-lg p-3 max-w-lg bg-card animate-pulse">
                <div className="h-4 bg-muted-foreground/20 rounded w-48"></div>
              </div>
            </div>
          )}

        </CardContent>
        
        <div className="mt-auto">
          <div className="relative">
            <Input 
              placeholder="Peça para o AI sugerir uma rotina baseada nos seus dados..." 
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
      
      <footer className="text-center text-xs text-muted-foreground mt-auto py-4">
        © 2024 PLANNER STUDIES - BUILT FOR PERFORMANCE
      </footer>
    </div>
  );
}
