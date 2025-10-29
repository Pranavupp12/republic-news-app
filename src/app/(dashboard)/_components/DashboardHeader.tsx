import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import { LogoutButton } from "./LogoutButton";

export function DashboardHeader({ user }: { user: User }) {
  const initials = user.name?.charAt(0).toUpperCase() || "A";
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <h1 className="text-xl font-bold">Republic News Portal</h1>
        <Popover>
          <PopoverTrigger asChild><Button variant="ghost" className="relative h-8 w-8 rounded-full"><Avatar className="h-9 w-9"><AvatarFallback>{initials}</AvatarFallback></Avatar></Button></PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="font-normal text-sm"><p className="font-medium">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></div>
            <div className="mt-2"><LogoutButton /></div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}