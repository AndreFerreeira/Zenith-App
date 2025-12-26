
"use client";
import { Bell, Home } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

export function Header() {
    const pathname = usePathname();
    const pageName = pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').toUpperCase() || 'HOME';
    
    // Don't render header on login page
    if (pathname === '/login') {
      return null;
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
            </div>
        </header>
    )
}
