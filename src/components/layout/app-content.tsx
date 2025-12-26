
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/firebase/auth/provider';
import { redirect, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { FloatingNav } from '@/components/layout/floating-nav';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login');

  useEffect(() => {
    if (!isLoading && !user && !isAuthPage) {
      redirect('/login');
    }
     if (!isLoading && user && isAuthPage) {
      redirect('/');
    }
  }, [user, isLoading, isAuthPage, pathname]);


  if (isLoading && !isAuthPage) {
     return (
        <div className="flex items-center justify-center h-screen w-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
     );
  }
  
  if (isAuthPage) {
    return <>{children}</>;
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
      <FirebaseErrorListener />
    </>
  );
}
