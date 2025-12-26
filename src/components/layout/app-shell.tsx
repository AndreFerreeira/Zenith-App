
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { FloatingNav } from '@/components/layout/floating-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/firebase/auth/provider';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login');
  const { isLoading } = useAuth();
  
  if (isAuthPage) {
    return <>{children}</>;
  }

  if (isLoading) {
     return (
        <div className="flex items-center justify-center h-screen w-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
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
