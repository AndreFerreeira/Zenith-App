'use client';

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Download, Upload, Search, Map, Bot, Send } from "lucide-react";
import { SparklesIcon } from "lucide-react";

export default function IaAssistantPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <Header />
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-tighter">AI Assistant Hub</h1>
          </div>
          <p className="text-muted-foreground">Privacidade total: seus dados ficam no seu navegador.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Upload className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="secondary">CHAT</Button>
        <Button variant="ghost">CONTEÚDO</Button>
        <Button variant="ghost">NOTAS</Button>
        <Button variant="ghost">VOZ</Button>
      </div>
      
      <Card className="flex-grow bg-card-foreground/5 border-none flex flex-col p-6">
        <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
          <BrainCircuit className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground tracking-widest text-sm">INICIE UMA NOVA ESTRATÉGIA</p>
        </CardContent>
        
        <div className="mt-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
              <Button variant="outline" size="sm" className="rounded-full"><Search className="h-4 w-4 mr-2"/> SEARCH MODE</Button>
              <Button variant="outline" size="sm" className="rounded-full"><Map className="h-4 w-4 mr-2"/> MAPS MODE</Button>
              <Button variant="outline" size="sm" className="rounded-full"><Bot className="h-4 w-4 mr-2"/> THINKING MODE</Button>
          </div>
          <div className="relative">
            <Input 
              placeholder="Peça auxílio estratégico ou análise de dados..." 
              className="bg-card border-none rounded-full h-14 pl-6 pr-16 text-base"
            />
            <Button size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary text-primary-foreground">
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