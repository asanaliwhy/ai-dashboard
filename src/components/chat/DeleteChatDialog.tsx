 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger,} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";


type DeleteChatDialogProps = {
  chatId: string;
  chatTitle: string;
  workspaceId: string
};

export function DeleteChatDialog({
  chatId,
  chatTitle,
  workspaceId
}: DeleteChatDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);

      const response = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to delete chat");
        return;
      }

      toast.success("Chat deleted");

      router.push(`/workspace/${workspaceId}`);
router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button type="button" variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete chat?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete{" "}
            <strong>{chatTitle}</strong> and all of its messages.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}