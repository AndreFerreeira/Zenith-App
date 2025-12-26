
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ZenithMasteryLogo } from '@/components/icons';
import { Chrome } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '@/firebase/auth/auth';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSignUp, setIsSignUp] = React.useState(false);
  const { toast } = useToast();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        toast({ title: 'Sucesso!', description: 'Conta criada. Bem-vindo(a)!' });
      } else {
        await signInWithEmail(email, password);
        toast({ title: 'Bem-vindo(a) de volta!' });
      }
    } catch (error: any) {
      console.error(isSignUp ? "Failed to sign up" : "Failed to sign in", error);
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: error.message || 'Não foi possível completar a ação.',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({ title: 'Login com Google bem-sucedido!' });
    } catch (error: any) => {
      console.error("Failed to sign in with Google", error);
      toast({
        variant: 'destructive',
        title: 'Erro de Login',
        description: error.message || 'Não foi possível fazer login com o Google.',
      });
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-sm p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center">
          <ZenithMasteryLogo className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold tracking-tighter">Zenith Mastery</h1>
          <p className="text-muted-foreground">
            {isSignUp ? 'Crie sua conta para começar' : 'Acesse sua conta para continuar'}
          </p>
        </div>

        <form onSubmit={handleAuthAction} className="space-y-4">
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 text-base"
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-12 text-base"
          />
          <Button type="submit" className="w-full h-12 text-base font-bold">
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </Button>
        </form>

        <div className="relative">
          <Separator />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
            <span className="bg-card px-2 text-xs text-muted-foreground">
              OU
            </span>
          </div>
        </div>

        <div className="space-y-2">
            <Button variant="outline" className="w-full h-12" onClick={handleGoogleSignIn}>
                <Chrome className="mr-2 h-5 w-5" />
                Continuar com Google
            </Button>
        </div>

        <div className="text-center text-sm">
          <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp
              ? 'Já tem uma conta? Faça login'
              : 'Não tem uma conta? Crie uma agora'}
          </Button>
        </div>
      </div>
    </div>
  );
}
