
'use client';

import { useAuth } from '@/firebase/auth/provider';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      redirect('/');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <div className="w-full max-w-sm space-y-8">
                <div className="flex flex-col items-center text-center">
                    <Skeleton className="h-12 w-12 mb-4" />
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32 mt-2" />
                </div>
                <div className='space-y-4'>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
                 <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 flex-grow" />
                </div>
            </div>
        </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }
  
  return null;
}
