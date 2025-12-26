'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { signInWithGoogle } from '@/firebase/auth/auth';
import { Button } from '@/components/ui/button';
import { ZenithMasteryLogo } from '@/components/icons';
import { Chrome } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      // The useEffect will handle the redirect
    } catch (error) {
      console.error('Failed to sign in with Google', error);
      // Optionally, show a toast notification to the user
    }
  };
  
  // While loading, or if the user is logged in (and redirecting), show a loading skeleton.
  if (isLoading || user) {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Skeleton className="h-24 w-24 rounded-full mb-4" />
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-12 w-80" />
      </div>
    );
  }

  // Only show login page if not loading and no user
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <div className="flex items-center gap-4 mb-4">
        <ZenithMasteryLogo className="h-16 w-16 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tighter font-archivio mb-2">
        Bem-vindo ao Zenith Mastery
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Faça login para sincronizar seu progresso e acessar seu painel de qualquer lugar.
      </p>
      <Button 
        onClick={handleLogin} 
        size="lg" 
        className="h-12 text-base"
      >
        <Chrome className="h-5 w-5 mr-2" />
        Entrar com Google
      </Button>
    </div>
  );
}
