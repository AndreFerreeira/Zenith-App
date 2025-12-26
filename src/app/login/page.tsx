
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/firebase/auth/auth';
import { Button } from '@/components/ui/button';
import { ZenithMasteryLogo } from '@/components/icons';
import { Chrome, Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast({ title: "Sucesso!", description: "Login com Google realizado." });
    } catch (error) {
      console.error('Failed to sign in with Google', error);
      toast({ variant: 'destructive', title: "Erro no Login", description: "Não foi possível fazer login com o Google." });
    }
  };

  const handleEmailSignIn = async (values: z.infer<typeof formSchema>) => {
    try {
      await signInWithEmail(values.email, values.password);
      toast({ title: "Sucesso!", description: "Login realizado." });
    } catch (error) {
      console.error("Failed to sign in with email", error);
      toast({ variant: 'destructive', title: "Erro no Login", description: "E-mail ou senha inválidos." });
    }
  };
  
  const handleEmailSignUp = async (values: z.infer<typeof formSchema>) => {
    try {
      await signUpWithEmail(values.email, values.password);
      toast({ title: "Conta Criada!", description: "Sua conta foi criada com sucesso. Você já está logado." });
    } catch (error: any) {
      console.error("Failed to sign up with email", error);
       if (error.code === 'auth/email-already-in-use') {
        toast({ variant: 'destructive', title: "Erro no Cadastro", description: "Este e-mail já está em uso." });
      } else {
        toast({ variant: 'destructive', title: "Erro no Cadastro", description: "Não foi possível criar sua conta." });
      }
    }
  };
  
  if (isLoading || user) {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Skeleton className="h-24 w-24 rounded-full mb-4" />
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-12 w-80" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <div className="flex flex-col items-center justify-center text-center w-full max-w-sm">
        <div className="flex items-center gap-4 mb-4">
            <ZenithMasteryLogo className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter font-archivio mb-2">
            Zenith Mastery
        </h1>
        <p className="text-muted-foreground mb-8">
            Faça login para sincronizar seu progresso e acessar seu painel de qualquer lugar.
        </p>
      
        <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
                <Card className="p-6 border-none shadow-none">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleEmailSignIn)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="seu@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Entrar com Email</Button>
                        </form>
                    </Form>
                </Card>
            </TabsContent>
            <TabsContent value="signup">
                <Card className="p-6 border-none shadow-none">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleEmailSignUp)} className="space-y-4">
                             <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="seu@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Criar Conta com Email</Button>
                        </form>
                    </Form>
                </Card>
            </TabsContent>
        </Tabs>

        <div className="flex items-center w-full my-6">
            <Separator className="flex-1" />
            <span className="px-4 text-xs text-muted-foreground">OU</span>
            <Separator className="flex-1" />
        </div>

        <Button 
            onClick={handleGoogleLogin} 
            size="lg" 
            variant="outline"
            className="h-12 text-base w-full"
        >
            <Chrome className="h-5 w-5 mr-2" />
            Continuar com Google
        </Button>
      </div>
    </div>
  );
}

