
"use client";
import { Bell, Home } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

export function Header() {
    const pathname = usePathname();
    const pageName = pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').toUpperCase() || 'HOME';

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
                <div className="flex items-center gap-2 bg-card-foreground/5 px-2 py-1 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://picsum.photos/seed/avatar1/40/40" />
                        <AvatarFallback>AF</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold">AND.FERREEIRA</p>
                        <p className="text-xs text-muted-foreground cursor-pointer hover:text-primary">LOGOUT</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
