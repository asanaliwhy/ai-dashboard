"use client";

import UserMenu from "./UserMenu";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

type TopbarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/workspace": "Workspaces",
  "/settings": "Settings",
  "/profile": "Profile",
};

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname();

  // Derive title from pathname
  let title = "Workspace Overview";
  for (const [path, label] of Object.entries(pageTitles)) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      title = label;
      break;
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <UserMenu user={user} />
      </div>
    </header>
  );
}