"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, Calendar, MoreVertical, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditWorkspaceDialog } from "./EditWorkspaceDialog";
import { DeleteWorkspaceDialog } from "./DeleteWorkspaceDialog";
import { useState } from "react";

type WorkspaceCardProps = {
  workspace: {
    id: string;
    name: string;
    color: string;
    description: string | null;
    chatCount: number;
    updatedAt: string;
  };
};

export default function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleCardClick = () => {
    router.push(`/workspace/${workspace.id}`);
  };

  return (
    <>
      <div className="group relative cursor-pointer" onClick={handleCardClick}>
        <Card className="hover-lift overflow-hidden border border-border/60 bg-card transition-all duration-200 hover:border-primary/40 shadow-xs">
          {/* Top Color Accent Ribbon */}
          <div
            className="h-1.5 w-full transition-opacity group-hover:opacity-90"
            style={{ backgroundColor: workspace.color }}
          />

          <CardHeader className="p-5 pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-bold text-white text-base shadow-xs transition-transform group-hover:scale-105"
                  style={{ backgroundColor: workspace.color }}
                >
                  {workspace.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-base tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {workspace.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {workspace.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Quick Actions Dropdown */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-10"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent opacity-0 group-hover:opacity-100 transition-all cursor-pointer outline-none"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                      Edit Workspace
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      Delete Workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-5 pb-4 pt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
              <div className="flex items-center gap-1.5 font-medium">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                <span>
                  {workspace.chatCount}{" "}
                  {workspace.chatCount === 1 ? "Conversation" : "Conversations"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[11px]">
                  <Calendar className="h-3 w-3" />
                  <span>{workspace.updatedAt}</span>
                </div>

                <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Open <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EditWorkspaceDialog
        workspace={workspace}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteWorkspaceDialog
        workspaceId={workspace.id}
        workspaceName={workspace.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}