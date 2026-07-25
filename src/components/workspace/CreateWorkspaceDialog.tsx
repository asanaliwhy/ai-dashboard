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
import { Plus } from "lucide-react";
import { CreateWorkspaceForm } from "./CreateWorkspaceForm";

type CreateWorkspaceDialogProps = {
  iconOnly?: boolean;
};

export function CreateWorkspaceDialog({ iconOnly = false }: CreateWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {iconOnly ? (
        <DialogTrigger
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          title="Create Workspace"
        >
          <Plus className="h-3.5 w-3.5" />
        </DialogTrigger>
      ) : (
        <DialogTrigger
          className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors cursor-pointer"
          title="Create Workspace"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Workspace</span>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Create Workspace
          </DialogTitle>
        </DialogHeader>
        <CreateWorkspaceForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}