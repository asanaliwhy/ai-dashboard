"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { EditChatForm } from "./EditChatForm";

type EditChatDialogProps = {
  chat: {
    id: string;
    title: string;
    aiModel: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
};

export function EditChatDialog({
  chat,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
}: EditChatDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (controlledOnOpenChange || (() => {})) : setInternalOpen;

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Chat</DialogTitle>
        </DialogHeader>

        <EditChatForm chat={chat} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}