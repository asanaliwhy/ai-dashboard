import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";
import { WorkspaceEmptyState } from "@/components/workspace/WorkspaceEmptyState";
import { FolderKanban } from "lucide-react";

export default async function WorkspacePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      chats: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const formattedData = workspaces.map((workspace) => ({
    id: workspace.id,
    name: workspace.name,
    description: workspace.description,
    color: workspace.color,
    chatCount: workspace.chats.length,
    updatedAt: workspace.updatedAt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));

  if (formattedData.length === 0) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center p-6">
        <WorkspaceEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-wider uppercase mb-1">
            <FolderKanban className="h-4 w-4" /> Overview
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Workspaces
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize your AI conversations, models, and knowledge context by project.
          </p>
        </div>

        <CreateWorkspaceDialog />
      </div>

      {/* Grid Layout */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {formattedData.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </div>
    </div>
  );
}
