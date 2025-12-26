
"use client";
import { Bell, Home, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useAuth } from "@/firebase/auth/provider";
import { signOut } from "@/firebase/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Header() {
    const { user } = useAuth();
    const pathname = usePathname();
    const pageName = pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').toUpperCase() || 'HOME';

    const handleSignOut = async () => {
        await signOut();
    };

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
                {user && (
                    <>
                        <div className="flex items-center gap-2">
                           <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL || undefined} />
                                <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold">{user.displayName || user.email}</p>
                            </div>
                        </div>
                         <Button variant="ghost" size="icon" onClick={handleSignOut}>
                            <LogOut className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </>
                )}
            </div>
        </header>
    )
}
