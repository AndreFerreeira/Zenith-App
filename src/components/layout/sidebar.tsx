
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ZenithHabitosLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Sparkles,
  Target,
  Wallet,
  Calendar,
  CheckCircle,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "@/firebase/auth/provider";
import { useAnnualGoals } from "@/firebase/firestore/data-hooks";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { data: goals } = useAnnualGoals(user?.uid);

  const progress = React.useMemo(() => {
    if (!goals || goals.length === 0) return 0;
    const completedGoals = goals.filter(g => g.completed).length;
    return (completedGoals / goals.length) * 100;
  }, [goals]);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <aside className="w-64 flex-shrink-0 bg-card p-4 flex flex-col justify-between min-h-screen">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ZenithHabitosLogo className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-bold">Zenith</p>
            <p className="text-xs text-muted-foreground">Hábitos</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mb-8 ml-10">STRATEGIC ROUTINE</div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={pathname === item.href ? "default" : "ghost"}
              className="justify-start gap-3"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-semibold">{item.name}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <div className="w-full h-px bg-border" />
        <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">CICLO ANUAL</p>
            <div className="flex justify-center items-center relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-muted-foreground/10" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    <circle
                        className="text-primary transition-all duration-500"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                    />
                </svg>
                <span className="absolute text-xl font-bold">{Math.round(progress)}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">META CONCLUÍDA</p>
        </div>
      </div>
    </aside>
  );
}

const navItems = [
  { name: "VISÃO GERAL", icon: LayoutDashboard, href: "/" },
  { name: "IA ASSISTENTE", icon: Sparkles, href: "/ia-assistant" },
  { name: "METAS DO ANO", icon: Target, href: "/annual-goals" },
  { name: "GESTÃO FINANCEIRA", icon: Wallet, href: "/financial-management" },
  { name: "ESTRATÉGIA MENSAL", icon: Calendar, href: "/monthly-strategy" },
  { name: "HABIT TRACKER", icon: CheckCircle, href: "/habit-tracker" },
  { name: "PLANEJAMENTO SEMANAL", icon: SlidersHorizontal, href: "/weekly-planning" },
];
