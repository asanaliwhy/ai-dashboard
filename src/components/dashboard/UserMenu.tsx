"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const fallbackLetter = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors cursor-pointer outline-none"
      >
        <Avatar className="h-8 w-8 border border-border/60">
          <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User avatar"} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
            {fallbackLetter}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1.5">
        <div className="px-2.5 py-2">
          <p className="font-semibold text-sm leading-tight text-foreground">{user.name || "User"}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email || ""}</p>
        </div>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          <div className="flex w-full items-center gap-2 text-xs">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Profile</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/settings")}
        >
          <div className="flex w-full items-center gap-2 text-xs">
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Settings</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <div className="flex w-full items-center gap-2 text-xs">
            <LogOut className="h-3.5 w-3.5" />
            <span>Log out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}