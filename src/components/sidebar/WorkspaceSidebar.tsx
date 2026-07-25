"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  User,
  Plus,
  MessageSquare,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";
import { SearchDialog } from "@/components/chat/SearchDialog";

type Workspace = {
  id: string;
  name: string;
  color: string;
};

type WorkspaceSidebarProps = {
  workspaces: Workspace[];
};

export function WorkspaceSidebar({ workspaces }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  const mainNav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Workspaces", href: "/workspace", icon: FolderKanban },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      <aside className="flex h-full w-60 flex-col gap-4 border-r bg-card p-4">
        {/* Logo & App title */}
        <div className="flex items-center justify-between px-2 py-1">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="h-4 w-4" />
            </div>
            AI Workspace
          </Link>
        </div>

        {/* Search trigger */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground font-normal text-xs h-9"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search chats...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Main Nav */}
        <nav className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="my-1 border-t" />

        {/* Workspaces list */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Workspaces
            </span>
            <CreateWorkspaceDialog />
          </div>

          <div className="mt-2 flex-1 space-y-1 overflow-y-auto pr-1">
            {workspaces.map((ws) => {
              const isActive = pathname.startsWith(`/workspace/${ws.id}`);

              return (
                <Link
                  key={ws.id}
                  href={`/workspace/${ws.id}`}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: ws.color }}
                  />
                  <span className="truncate">{ws.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
