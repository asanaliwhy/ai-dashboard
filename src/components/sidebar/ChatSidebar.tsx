"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CreateChatDialog } from "@/components/chat/CreateChatDialog";

type ChatItem = {
  id: string;
  title: string;
  aiModel: string;
  updatedAt: string | Date;
};

type ChatSidebarProps = {
  workspaceId: string;
  workspaceName: string;
  chats: ChatItem[];
};

export function ChatSidebar({
  workspaceId,
  workspaceName,
  chats,
}: ChatSidebarProps) {
  const pathname = usePathname();
  const [filter, setFilter] = useState("");

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card/50 p-4">
      <div className="flex items-center justify-between gap-2 pb-2">
        <h2 className="font-semibold text-sm truncate">{workspaceName}</h2>
        <CreateChatDialog workspaceId={workspaceId} />
      </div>

      <div className="relative my-2">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Filter chats..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-8 pl-8 text-xs"
        />
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto mt-2 pr-1">
        {filteredChats.length === 0 ? (
          <p className="p-3 text-center text-xs text-muted-foreground">
            {filter ? "No matching chats" : "No chats yet"}
          </p>
        ) : (
          filteredChats.map((chat) => {
            const href = `/workspace/${workspaceId}/chat/${chat.id}`;
            const isActive = pathname === href;

            return (
              <Link
                key={chat.id}
                href={href}
                className={cn(
                  "flex flex-col gap-0.5 rounded-lg px-3 py-2.5 text-xs transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate font-medium">{chat.title}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] opacity-75 pl-5">
                  <span>{chat.aiModel}</span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
}
