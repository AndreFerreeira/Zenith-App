"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { financialData } from "@/lib/data";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export function FinancialOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Financial Overview
        </CardTitle>
        <CardDescription>{financialData.summary}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="text-4xl font-bold tracking-tighter text-primary">
          ${financialData.balance.toLocaleString()}
        </div>
        <div className="h-[200px]">
            <ChartContainer config={{
                income: { label: 'Income', color: 'hsl(var(--chart-1))' },
                expenses: { label: 'Expenses', color: 'hsl(var(--chart-2))' },
            }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={50} />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
