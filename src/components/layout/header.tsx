
"use client";
import { Bell, Home, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { signOut } from "@/firebase/auth/auth";
import { Skeleton } from "../ui/skeleton";

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading } = useUser();

    const pageName = pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').toUpperCase() || 'HOME';

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };
    
    // Don't render header on login page
    if (pathname === '/login') {
      return null;
    }

    if (isLoading) {
        return (
            <header className="flex justify-between items-center">
                <div>
                   <Skeleton className="h-5 w-48 mb-2" />
                   <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-48 rounded-full" />
                </div>
            </header>
        )
    }
    
    if (!user) {
        // Redirect to login if not authenticated
        if (typeof window !== 'undefined') {
            router.push('/login');
        }
        return null; // or a loading spinner
    }

    return (
        <header className="flex justify-between items-center">
            <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Home className="h-4 w-4" /> {pageName} / Home</p>
                <h2 className="text-lg font-semibold">MASTERY PLAN</h2>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                </Button>
                <div className="flex items-center gap-3 bg-card-foreground/5 px-2 py-1 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || undefined} />
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold">{user.displayName || "Usuário"}</p>
                        <p className="text-xs text-muted-foreground cursor-pointer hover:text-primary flex items-center gap-1" onClick={handleSignOut}>
                            <LogOut className="h-3 w-3" />
                            LOGOUT
                        </p>
                    </div>
                </div>
            </div>
        </header>
    )
}
