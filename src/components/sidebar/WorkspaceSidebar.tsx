"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  User,
  Search,
  Sparkles,
} from "lucide-react";
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
      <aside className="flex h-full w-64 flex-col gap-4 border-r border-border/60 bg-card/60 p-4 backdrop-blur-md shrink-0">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-2 py-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-bold text-base tracking-tight text-foreground"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span>AI Workspace</span>
          </Link>
        </div>

        {/* Search trigger button */}
        <button
          type="button"
          className="w-full flex items-center gap-2 text-muted-foreground text-xs h-9 px-3 rounded-lg border border-border/60 bg-background/50 hover:bg-accent transition-colors cursor-pointer"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search chats...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            ⌘K
          </kbd>
        </button>

        {/* Main Nav */}
        <nav className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="my-1 border-t border-border/40" />

        {/* Workspaces Section */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Workspaces ({workspaces.length})
            </span>
            <CreateWorkspaceDialog iconOnly />
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto pr-1">
            {workspaces.map((ws) => {
              const href = `/workspace/${ws.id}`;
              const isActive = pathname.startsWith(href);

              return (
                <Link
                  key={ws.id}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0 shadow-xs"
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
