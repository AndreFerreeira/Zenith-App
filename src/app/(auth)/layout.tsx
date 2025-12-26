
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

  if (isLoading || user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="w-full max-w-sm space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                 <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 flex-grow" />
                    <Skeleton className="h-8 w-24" />
                </div>
            </div>
        </div>
    );
  }

  return <>{children}</>;
}
