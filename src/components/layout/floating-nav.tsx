
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Target,
  Wallet,
  Calendar,
  CheckCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Visão Geral', icon: LayoutDashboard, href: '/' },
  { name: 'IA Assistente', icon: Sparkles, href: '/ia-assistant' },
  { name: 'Metas do Ano', icon: Target, href: '/annual-goals' },
  { name: 'Gestão Financeira', icon: Wallet, href: '/financial-management' },
  { name: 'Estratégia Mensal', icon: Calendar, href: '/monthly-strategy' },
  { name: 'Habit Tracker', icon: CheckCircle, href: '/habit-tracker' },
  { name: 'Planejamento Semanal', icon: SlidersHorizontal, href: '/weekly-planning' },
];

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-card border border-border p-2 rounded-full flex items-center gap-2 shadow-lg">
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  size="icon"
                  className={cn(
                    'rounded-full h-12 w-12',
                     pathname === item.href && 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
