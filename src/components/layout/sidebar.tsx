"use client";

import { ZenithMasteryLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Sparkles,
  Target,
  Wallet,
  Calendar,
  CircleHelp,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const navItems = [
  { name: "VISÃO GERAL", icon: LayoutDashboard, active: true },
  { name: "IA ASSISTENTE", icon: Sparkles },
  { name: "METAS DO ANO", icon: Target },
  { name: "GESTÃO FINANCEIRA", icon: Wallet },
  { name: "ESTRATÉGIA MENSAL", icon: Calendar },
  { name: "HABIT TRACKER", icon: CircleHelp },
  { name: "PLANEJAMENTO SEMANAL", icon: SlidersHorizontal },
];

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-card p-4 flex flex-col justify-between min-h-screen">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ZenithMasteryLogo className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-bold">Zenith</p>
            <p className="text-xs text-muted-foreground">Mastery OS</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mb-8 ml-10">STRATEGIC ROUTINE</div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={item.active ? "default" : "ghost"}
              className="justify-start gap-3"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-semibold">{item.name}</span>
            </Button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <div className="w-full h-px bg-border" />
        <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">CICLO ANUAL</p>
            <div className="flex justify-center items-center relative w-24 h-24 mx-auto">
                <Progress value={98} className="w-24 h-24 absolute" indicatorClassName="hidden" />
                <svg className="w-24 h-24 transform -rotate-90">
                    <circle className="text-muted-foreground/10" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                    <circle
                        className="text-primary"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={(2 * Math.PI * 40) - (98 / 100) * (2 * Math.PI * 40)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="48"
                        cy="48"
                    />
                </svg>
                <span className="absolute text-xl font-bold">98%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">META CONCLUÍDA</p>
        </div>
      </div>
    </aside>
  );
}

// Custom progress indicator to hide it
declare module "@/components/ui/progress" {
    interface ProgressProps {
        indicatorClassName?: string
    }
}
