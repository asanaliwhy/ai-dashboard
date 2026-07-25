"use client";

import Link from "next/link";
import {
  ArrowLeft,
  MoreVertical,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditChatDialog } from "./EditChatDialog";
import { DeleteChatDialog } from "./DeleteChatDialog";

interface ChatHeaderProps {
  chatTitle: string;
  model: string;
  color: string;
  workspaceId: string;
  chatId: string,
}

export function ChatHeader({
  chatTitle,
  model,
  color,
  workspaceId,
  chatId,
}: ChatHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Link href={`/workspace/${workspaceId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Workspace</span>
          </Link>
        </Button>

        <div className="h-4 w-[1px] bg-border" />
        <div
          className="h-4 w-4 rounded-sm shrink-0"
          style={{ backgroundColor: color }}
        />
        <h1 className="text-sm font-semibold text-foreground tracking-tight line-clamp-1">
          {chatTitle}
        </h1>
        <Badge variant="secondary" className="gap-1 font-mono text-xs font-normal">
          <Sparkles className="h-3 w-3 text-blue-500" />
          {model}
        </Badge>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <EditChatDialog
            chat={{
              id: chatId,
              title: chatTitle,
              aiModel: model,
            }}
          />
          <DropdownMenuSeparator />
          <DeleteChatDialog
            chatId={chatId}
            workspaceId={workspaceId}
            chatTitle={chatTitle}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}