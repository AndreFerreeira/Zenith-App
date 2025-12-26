
'use client';

import React from 'react';
import { usePathname, redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { FloatingNav } from '@/components/layout/floating-nav';
import { useAuth } from '@/firebase/auth/provider';
import { ZenithHabitosLogo } from '../icons';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const isAuthPage = pathname.startsWith('/login');

  React.useEffect(() => {
    if (!isLoading && !user && !isAuthPage) {
      redirect('/login');
    }
  }, [user, isLoading, isAuthPage]);


  if (isAuthPage) {
    return <>{children}</>;
  }

  if (isLoading || !user) {
     return (
        <div className="flex items-center justify-center h-screen w-screen bg-background">
          <div className='flex flex-col items-center gap-4'>
            <ZenithHabitosLogo className="h-16 w-16 text-primary animate-pulse" />
            <p className='text-muted-foreground text-sm'>Carregando seu plano de mestre...</p>
          </div>
        </div>
     );
  }

  return (
    <>
      <div className="flex">
        <div className='hidden md:block'><Sidebar /></div>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen flex flex-col pb-28">
          {children}
        </main>
      </div>
      <div className='md:hidden'><FloatingNav /></div>
    </>
  );
}
