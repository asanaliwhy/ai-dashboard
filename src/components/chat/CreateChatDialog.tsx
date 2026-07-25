"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateChatForm } from "@/components/chat/CreateChatForm";

type CreateChatDialogProps = {
  workspaceId: string;
};

export function CreateChatDialog({ workspaceId }: CreateChatDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
      >
        Create Chat
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Chat</DialogTitle>
        </DialogHeader>
        <CreateChatForm
          workspaceId={workspaceId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}