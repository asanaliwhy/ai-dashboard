"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, Sparkles, Calendar, ArrowRight, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteChatDialog } from "./DeleteChatDialog";
import { EditChatDialog } from "./EditChatDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

type ChatCardProps = {
  chat: {
    id: string;
    title: string;
    aiModel: string;
    updatedAt: string;
    workspaceId: string;
  };
};

export function ChatCard({ chat }: ChatCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleCardClick = () => {
    router.push(`/workspace/${chat.workspaceId}/chat/${chat.id}`);
  };

  return (
    <>
      <div
        className="group relative cursor-pointer"
        onClick={handleCardClick}
      >
        <Card className="hover-lift overflow-hidden border border-border/60 bg-card/80 transition-all duration-200 hover:border-primary/40 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-medium shadow-xs">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {chat.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 font-medium bg-muted text-muted-foreground gap-1"
                  >
                    <Sparkles className="h-2.5 w-2.5 text-primary" />
                    {chat.aiModel}
                  </Badge>
                </div>
              </div>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative z-10"
            >
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-all cursor-pointer outline-none"
                >
                  <MoreVertical className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    Rename Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Calendar className="h-3 w-3" />
              <span>{chat.updatedAt}</span>
            </div>

            <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
              Open <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Card>
      </div>

      <EditChatDialog
        chat={{ id: chat.id, title: chat.title, aiModel: chat.aiModel }}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteChatDialog
        chatId={chat.id}
        chatTitle={chat.title}
        workspaceId={chat.workspaceId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}