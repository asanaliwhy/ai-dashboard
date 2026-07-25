"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditChatForm } from "./EditChatForm";

type EditChatDialogProps = {
  chat: {
    id: string;
    title: string,
    aiModel: string
  };
};

export function EditChatDialog({
  chat,
}: EditChatDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Chat</DialogTitle>
        </DialogHeader>

        <EditChatForm
          chat={chat}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}