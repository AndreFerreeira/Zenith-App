
'use client';

import * as React from 'react';
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  TrendingUp,
  Wallet,
  Plus,
  ArrowUpRight,
  ListTodo,
  Landmark,
  X,
  Trash2,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import type { Transaction, WishlistItem } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

const chartData = [
  { month: "Jan", balance: 186 },
  { month: "Feb", balance: 305 },
  { month: "Mar", balance: 237 },
  { month: "Apr", balance: 173 },
  { month: "May", balance: 209 },
  { month: "Jun", balance: 214 },
];

const chartConfig = {
  balance: {
    label: "Saldo",
    color: "hsl(var(--chart-1))",
  },
};

export default function FinancialManagementPage() {
  const [evolutionGoal, setEvolutionGoal] = React.useState(50000);
  const [newTransactionDesc, setNewTransactionDesc] = React.useState("");
  const [newTransactionValue, setNewTransactionValue] = React.useState("");
  const [newTransactionType, setNewTransactionType] = React.useState<"entrada" | "saida">("saida");
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [newWishlistItem, setNewWishlistItem] = React.useState("");
  const [wishlist, setWishlist] = React.useState<WishlistItem[]>([]);

  const handleAddTransaction = () => {
    const value = parseFloat(newTransactionValue);
    if (newTransactionDesc.trim() === "" || isNaN(value)) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(),
      description: newTransactionDesc,
      amount: value,
      type: newTransactionType,
      date: new Date(),
    };

    setTransactions([...transactions, newTransaction]);
    setNewTransactionDesc("");
    setNewTransactionValue("");
  };

  const handleAddWishlistItem = () => {
    if (newWishlistItem.trim() === "") return;
    const newItem: WishlistItem = {
      id: Math.random().toString(),
      name: newWishlistItem,
    };
    setWishlist([...wishlist, newItem]);
    setNewWishlistItem("");
  };

  const handleRemoveWishlistItem = (id: string) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };
  
  const totalGains = transactions
    .filter(t => t.type === 'entrada')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'saida')
    .reduce((acc, t) => acc + t.amount, 0);

  const currentBalance = totalGains - totalExpenses;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div className="flex flex-col gap-8">
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card-foreground/5 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              SONHO FINANCEIRO
            </CardTitle>
            <Target className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Liberdade Plena</div>
          </CardContent>
        </Card>
        <Card className="bg-card-foreground/5 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              META DE EVOLUÇÃO
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
             <Input 
                type="number" 
                value={evolutionGoal}
                onChange={(e) => setEvolutionGoal(parseFloat(e.target.value))}
                className="bg-transparent border-none text-2xl font-bold p-0 h-auto focus-visible:ring-0"
              />
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SALDO ATUAL</CardTitle>
            <Wallet className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentBalance)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card-foreground/5 border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Plus className="h-5 w-5" />
                Nova Transação
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Input placeholder="Descrição..." className="bg-card border-none" value={newTransactionDesc} onChange={(e) => setNewTransactionDesc(e.target.value)} />
              <Input placeholder="Valor..." type="number" className="bg-card border-none w-40" value={newTransactionValue} onChange={(e) => setNewTransactionValue(e.target.value)} />
              <Select value={newTransactionType} onValueChange={(value: "entrada" | "saida") => setNewTransactionType(value)}>
                <SelectTrigger className="w-32 bg-card border-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saida">Saída</SelectItem>
                  <SelectItem value="entrada">Entrada</SelectItem>
                </SelectContent>
              </Select>
              <Button size="icon" className="h-9 w-9 flex-shrink-0" onClick={handleAddTransaction}>
                <Plus className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card-foreground/5 border-none h-[300px] flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold">
                  Histórico de Movimentações
                </CardTitle>
                <div className="text-sm">
                  <span className="text-green-400">GANHOS {formatCurrency(totalGains)}</span>
                  <span className="text-muted-foreground mx-2">|</span>
                  <span className="text-red-400">GASTOS {formatCurrency(totalExpenses)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col text-center overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center">
                  <Landmark className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma transação registrada.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map(t => (
                    <div key={t.id} className="flex justify-between items-center bg-card p-2 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-left">{t.description}</p>
                        <p className="text-xs text-muted-foreground text-left">{t.date.toLocaleDateString()}</p>
                      </div>
                      <Badge variant={t.type === 'entrada' ? 'default' : 'destructive'} className={t.type === 'entrada' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                        {t.type === 'entrada' ? '+' : '-'} {formatCurrency(t.amount)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
            <Card className="bg-card-foreground/5 border-none h-[300px] flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <ArrowUpRight className="h-5 w-5" />
                        Evolução de Saldo
                    </CardTitle>
                     <p className="text-xs text-muted-foreground">SALDO ACUMULADO POR PERÍODO</p>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="balance" fill="var(--color-balance)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="bg-card-foreground/5 border-none h-[220px] flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <ListTodo className="h-5 w-5" />
                        Wishlist
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col text-center">
                    {wishlist.length === 0 ? (
                      <p className="text-muted-foreground mb-4 m-auto">SUA LISTA ESTÁ VAZIA</p>
                    ) : (
                      <div className='space-y-2 overflow-y-auto'>
                      {wishlist.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-card p-2 rounded-md group">
                          <span className="text-sm">{item.name}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveWishlistItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 w-full mt-auto">
                        <Input placeholder="Desejo..." className="bg-card border-none h-9" value={newWishlistItem} onChange={e => setNewWishlistItem(e.target.value)} />
                        <Button size="icon" className="h-9 w-9 flex-shrink-0" onClick={handleAddWishlistItem}>
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    