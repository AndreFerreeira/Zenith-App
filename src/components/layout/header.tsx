
"use client";
import { Bell, Home, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useAuth } from "@/firebase/auth/provider";
import { signOut } from "@/firebase/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";


export function Header() {
    const { user } = useAuth();
    const pathname = usePathname();
    const pageName = pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').toUpperCase() || 'HOME';
    const { permission, requestPermission, setNotificationsEnabled, notificationsEnabled } = useNotifications();


    const handleSignOut = async () => {
        await signOut();
    };

    const handleNotificationClick = () => {
        if (permission === 'default') {
            requestPermission();
        } else if (permission === 'granted') {
            setNotificationsEnabled(!notificationsEnabled);
        } else {
            // User has denied permission, maybe show a toast explaining how to enable it in browser settings
            alert("Você bloqueou as notificações. Para recebê-las, precisa alterar as permissões do site nas configurações do seu navegador.");
        }
    }

    return (
        <header className="flex justify-between items-center">
            <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Home className="h-4 w-4" /> {pageName} / Home</p>
                <h2 className="text-lg font-semibold">MASTERY PLAN</h2>
            </div>
            <div className="flex items-center gap-4">
                 <Button variant="ghost" size="icon" onClick={handleNotificationClick} title={notificationsEnabled ? "Desativar notificações" : "Ativar notificações"}>
                    <Bell className={cn("h-5 w-5 text-muted-foreground", notificationsEnabled && "fill-primary text-primary")} />
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
