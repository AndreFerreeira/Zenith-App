
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
  Trash2,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Badge } from '@/components/ui/badge';
import { format, getMonth, getYear, startOfMonth, parse, set, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/firebase/auth/provider';
import { useTransactions, useWishlist, useUserDocument, addTransaction, deleteTransaction, addWishlistItem, deleteWishlistItem, updateUserDocument } from '@/firebase/firestore/data-hooks';
import type { Transaction, WishlistItem } from '@/firebase/firestore/data-hooks';

const chartConfig = {
  balance: {
    label: "Saldo",
    color: "hsl(var(--chart-1))",
  },
};

export default function FinancialManagementPage() {
  const { user } = useAuth();
  const { data: userDoc, isLoading: isUserDocLoading } = useUserDocument(user?.uid);
  const { data: transactions, isLoading: isTransactionsLoading } = useTransactions(user?.uid);
  const { data: wishlist, isLoading: isWishlistLoading } = useWishlist(user?.uid);

  const [evolutionGoal, setEvolutionGoal] = React.useState(0);
  const [newTransactionDesc, setNewTransactionDesc] = React.useState("");
  const [newTransactionValue, setNewTransactionValue] = React.useState("");
  const [newTransactionType, setNewTransactionType] = React.useState<"entrada" | "saida">("saida");
  const [newWishlistItem, setNewWishlistItem] = React.useState("");

  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  
  React.useEffect(() => {
    if (userDoc?.financialGoal) {
      setEvolutionGoal(userDoc.financialGoal);
    }
  }, [userDoc]);

  const handleGoalBlur = () => {
    if (user?.uid && userDoc?.financialGoal !== evolutionGoal) {
      updateUserDocument(user.uid, { financialGoal: evolutionGoal });
    }
  };

  const handleAddTransaction = () => {
    if (!user?.uid) return;
    const value = parseFloat(newTransactionValue);
    if (newTransactionDesc.trim() === "" || isNaN(value)) return;

    const transactionDate = set(new Date(), { year: selectedYear, month: selectedMonth, date: 1 });

    const newTransaction = {
      description: newTransactionDesc,
      amount: value,
      type: newTransactionType,
      date: transactionDate.toISOString(),
    };

    addTransaction(user.uid, newTransaction);
    setNewTransactionDesc("");
    setNewTransactionValue("");
  };

  const handleRemoveTransaction = (id: string) => {
    if (!user?.uid) return;
    deleteTransaction(user.uid, id);
  };

  const handleAddWishlistItem = () => {
    if (!user?.uid || newWishlistItem.trim() === "") return;
    addWishlistItem(user.uid, { name: newWishlistItem });
    setNewWishlistItem("");
  };

  const handleRemoveWishlistItem = (id: string) => {
    if (!user?.uid) return;
    deleteWishlistItem(user.uid, id);
  };
  
  const parsedTransactions = React.useMemo(() => 
    (transactions || []).map(t => ({ ...t, date: parseISO(t.date) }))
  , [transactions]);

  const totalGains = parsedTransactions
    .filter(t => t.type === 'entrada')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = parsedTransactions
    .filter(t => t.type === 'saida')
    .reduce((acc, t) => acc + t.amount, 0);

  const currentBalance = totalGains - totalExpenses;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(0, i), 'MMMM', { locale: ptBR }),
  }));

  const years = React.useMemo(() => {
    const referenceYear = 2025;
    const transactionYears = parsedTransactions.map(t => getYear(t.date));
    const futureYears = Array.from({ length: 6 }, (_, i) => referenceYear + i); // 2025 + 5 years
    
    const allYears = new Set([
      referenceYear,
      ...transactionYears,
      ...futureYears,
    ]);
    
    return Array.from(allYears).sort((a, b) => a - b);
  }, [parsedTransactions]);
  
  const filteredTransactions = parsedTransactions.filter(
    (t) => getMonth(t.date) === selectedMonth && getYear(t.date) === selectedYear
  );

  const chartData = React.useMemo(() => {
    const allTransactions = [...parsedTransactions];
    allTransactions.sort((a,b) => a.date.getTime() - b.date.getTime());
  
    const monthlyData: { [key: string]: number } = {};
  
    allTransactions.forEach(t => {
      const monthKey = format(startOfMonth(t.date), 'yyyy-MM');
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
    });
    
    allTransactions.forEach(t => {
      const monthKey = format(startOfMonth(t.date), 'yyyy-MM');
      if (t.type === 'entrada') {
        monthlyData[monthKey] += t.amount;
      } else {
        monthlyData[monthKey] -= t.amount;
      }
    });
  
    const sortedMonthKeys = Object.keys(monthlyData).sort();
    
    let accumulatedBalance = 0;
    const chartPoints = sortedMonthKeys.map(monthKey => {
      accumulatedBalance += monthlyData[monthKey];
      const date = parse(monthKey, 'yyyy-MM', new Date());
      return {
        month: format(date, 'MMM/yy', { locale: ptBR }),
        balance: accumulatedBalance,
      };
    });
  
    return chartPoints.slice(-6);
  }, [parsedTransactions]);


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
                onChange={(e) => setEvolutionGoal(parseFloat(e.target.value) || 0)}
                onBlur={handleGoalBlur}
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
                <div className="flex items-center gap-2">
                   <Select
                    value={String(selectedMonth)}
                    onValueChange={(value) => setSelectedMonth(Number(value))}
                  >
                    <SelectTrigger className="w-36 bg-card border-none h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={String(month.value)}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={String(selectedYear)}
                    onValueChange={(value) => setSelectedYear(Number(value))}
                  >
                    <SelectTrigger className="w-24 bg-card border-none h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col text-center overflow-y-auto">
              {filteredTransactions.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center">
                  <Landmark className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma transação para este período.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTransactions.map(t => (
                    <div key={t.id} className="flex justify-between items-center bg-card p-2 rounded-md group">
                      <div>
                        <p className="text-sm font-medium text-left">{t.description}</p>
                        <p className="text-xs text-muted-foreground text-left">{t.date.toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={t.type === 'entrada' ? 'default' : 'destructive'} className={t.type === 'entrada' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                          {t.type === 'entrada' ? '+' : '-'} {formatCurrency(t.amount)}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveTransaction(t.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
                              tickFormatter={(value) => value.slice(0, 6)}
                            />
                             <YAxis hide={true} />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(value as number)} />}
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
                    {isWishlistLoading ? <p>Carregando...</p> : (wishlist || []).length === 0 ? (
                      <p className="text-muted-foreground mb-4 m-auto">SUA LISTA ESTÁ VAZIA</p>
                    ) : (
                      <div className='space-y-2 overflow-y-auto'>
                      {(wishlist || []).map(item => (
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
                        <Input placeholder="Desejo..." className="bg-card border-none h-9" value={newWishlistItem} onChange={e => setNewWishlistItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddWishlistItem()} />
                        <Button size="icon" className="h-9 w-9 flex-shrink-0" onClick={handleAddWishlistItem}>
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>
                </CardContent>
        </div>
      </div>
    </div>
  );
}
