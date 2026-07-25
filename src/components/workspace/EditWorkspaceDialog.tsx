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
import { EditWorkspaceForm } from "./EditWorkspaceForm";

type EditWorkspaceDialogProps = {
  workspace: {
    id: string;
    name: string;
    description: string | null;
    color: string;
  };
};

export function EditWorkspaceDialog({
  workspace,
}: EditWorkspaceDialogProps) {
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
          <DialogTitle>Edit Workspace</DialogTitle>
        </DialogHeader>

        <EditWorkspaceForm
          workspace={workspace}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}