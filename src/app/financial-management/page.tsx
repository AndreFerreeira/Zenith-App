
'use client';

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
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
            <div className="text-2xl font-bold">R$ 50.000,00</div>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SALDO ATUAL</CardTitle>
            <Wallet className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
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
              <Input placeholder="Descrição..." className="bg-card border-none" />
              <Input placeholder="Valor..." type="number" className="bg-card border-none w-40" />
              <Select defaultValue="saida">
                <SelectTrigger className="w-32 bg-card border-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saida">Saída</SelectItem>
                  <SelectItem value="entrada">Entrada</SelectItem>
                </SelectContent>
              </Select>
              <Button size="icon" className="h-9 w-9 flex-shrink-0">
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
                  <span className="text-green-400">GANHOS R$ 0,00</span>
                  <span className="text-muted-foreground mx-2">|</span>
                  <span className="text-red-400">GASTOS R$ 0,00</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
              <Landmark className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                Nenhuma transação registrada.
              </p>
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
                <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                    <p className="text-muted-foreground mb-4">SUA LISTA ESTÁ VAZIA</p>
                    <div className="flex items-center gap-2 w-full">
                        <Input placeholder="Desejo..." className="bg-card border-none h-9" />
                        <Button size="icon" className="h-9 w-9 flex-shrink-0">
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
