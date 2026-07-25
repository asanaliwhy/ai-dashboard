"use client";

import Link from "next/link";
import { ChevronLeft, Sparkles, Settings2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EditChatDialog } from "./EditChatDialog";
import { DeleteChatDialog } from "./DeleteChatDialog";
import { useState } from "react";

type ChatHeaderProps = {
  chatId: string;
  workspaceId: string;
  chatTitle: string;
  model: string;
  color: string;
};

export function ChatHeader({
  chatId,
  workspaceId,
  chatTitle,
  model,
  color,
}: ChatHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={`/workspace/${workspaceId}`}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>

        <div
          className="h-3 w-3 rounded-full shrink-0 shadow-xs"
          style={{ backgroundColor: color }}
        />

        <div className="flex items-center gap-2 min-w-0">
          <h1 className="font-semibold text-base tracking-tight text-foreground truncate">
            {chatTitle}
          </h1>

          <Badge
            variant="secondary"
            className="hidden sm:flex text-[11px] font-normal gap-1 bg-muted px-2 py-0.5"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            {model}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          title="Chat settings"
        >
          <Settings2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          title="Delete chat"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {editOpen && (
        <EditChatDialog
          chat={{ id: chatId, title: chatTitle, aiModel: model }}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}

      {deleteOpen && (
        <DeleteChatDialog
          chatId={chatId}
          chatTitle={chatTitle}
          workspaceId={workspaceId}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        />
      )}
    </header>
  );
}