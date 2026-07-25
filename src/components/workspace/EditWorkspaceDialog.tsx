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
import { EditWorkspaceForm } from "./EditWorkspaceForm";

type EditWorkspaceDialogProps = {
  workspace: {
    id: string;
    name: string;
    description: string | null;
    color: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
};

export function EditWorkspaceDialog({
  workspace,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
}: EditWorkspaceDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? controlledOnOpenChange || (() => {})
    : setInternalOpen;

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
          <DialogTitle>Edit Workspace</DialogTitle>
        </DialogHeader>

        <EditWorkspaceForm workspace={workspace} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}