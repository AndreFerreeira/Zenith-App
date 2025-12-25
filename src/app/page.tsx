import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Check, SlidersHorizontal, Target, Wallet, Calendar, Sparkles, Heart, CircleDashed } from "lucide-react";


const overviewCards = [
  {
    title: "METAS ATIVAS",
    value: "0",
    icon: Target,
  },
  {
    title: "SALDO ATUAL",
    value: "R$ 0",
    icon: Wallet,
  },
  {
    title: "HÁBITOS HOJE",
    value: "0/0",
    icon: Check,
  },
  {
    title: "PRÓXIMO EVENTO",
    value: "Livre",
    icon: Calendar,
  },
];

export default function Home() {
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
        <Button variant="secondary" size="sm"><Sparkles className="h-4 w-4" /> Assistente IA</Button>
        <Button variant="outline" size="sm"><Wallet className="h-4 w-4" /> Finanças</Button>
        <Button variant="outline" size="sm"><Check className="h-4 w-4" /> Hábitos</Button>
        <Button variant="outline" size="sm"><SlidersHorizontal className="h-4 w-4" /> Planejamento</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <Card key={index} className="p-6 flex flex-col justify-between group">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-4">
                <card.icon className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between group">
           <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Valores Centrais</h3>
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <div className="flex items-center gap-4 mt-8">
             <CircleDashed className="h-10 w-10 text-muted-foreground/20" />
            <p className="text-muted-foreground">Defina seus valores na aba Metas do Ano.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
             <Button variant="secondary" className="w-full">VERIFICAR HÁBITOS</Button>
             <Button variant="outline" className="w-full">PLAN SEMANAL</Button>
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
            <Button variant="secondary" className="w-full bg-black text-white hover:bg-black/80">ACESSAR PLANEJAMENTO</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
