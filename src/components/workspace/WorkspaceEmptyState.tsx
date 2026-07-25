"use client";

import { FolderPlus, Sparkles } from "lucide-react";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";

export function WorkspaceEmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border/60 rounded-2xl bg-card/40">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-xs">
        <FolderPlus className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-bold tracking-tight text-foreground">
        No Workspaces Yet
      </h3>

      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        Workspaces help you organize AI conversations, custom knowledge documents, and model settings for different projects.
      </p>

      <div className="mt-6">
        <CreateWorkspaceDialog />
      </div>
    </div>
  );
}