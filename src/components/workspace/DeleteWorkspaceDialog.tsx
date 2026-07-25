"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

type DeleteWorkspaceDialogProps = {
  workspaceId: string;
  workspaceName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
};

export function DeleteWorkspaceDialog({
  workspaceId,
  workspaceName,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
}: DeleteWorkspaceDialogProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? controlledOnOpenChange || (() => {})
    : setInternalOpen;

  async function handleDelete() {
    try {
      setLoading(true);

      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to delete workspace");
        return;
      }

      toast.success("Workspace deleted");
      setOpen(false);
      onSuccess?.();

      if (pathname === `/workspace/${workspaceId}`) {
        router.push("/workspace");
      } else {
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <AlertDialogTrigger
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete workspace?</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete <strong>{workspaceName}</strong> and
            all of its chats. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}