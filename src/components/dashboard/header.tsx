import Image from "next/image";
import { ZenithMasteryLogo } from "@/components/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Header() {
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-2">
        <ZenithMasteryLogo className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Zenith Mastery
        </h1>
      </div>
      <div className="ml-auto">
        <Avatar>
          {userAvatar && (
            <AvatarImage 
              src={userAvatar.imageUrl} 
              alt={userAvatar.description} 
              data-ai-hint={userAvatar.imageHint}
            />
          )}
          <AvatarFallback>ZM</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
