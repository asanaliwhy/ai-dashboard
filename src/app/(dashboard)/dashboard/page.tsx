import { auth } from "@/auth";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FolderKanban, MessageSquare, Files, HardDrive, Sparkles } from "lucide-react";
import { RecentWorkspaces } from "@/components/dashboard/RecentWorkspaces";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [workspaceCount, chatCount, fileCount, fileStorage] = await Promise.all([
    prisma.workspace.count({
      where: { userId: session.user.id },
    }),
    prisma.chat.count({
      where: { userId: session.user.id },
    }),
    prisma.file.count({
      where: { userId: session.user.id },
    }),
    prisma.file.aggregate({
      where: { userId: session.user.id },
      _sum: { size: true },
    }),
  ]);

  const totalBytes = fileStorage._sum.size || 0;
  const storageFormatted =
    totalBytes > 1024 * 1024 * 1024
      ? `${(totalBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
      : totalBytes > 1024 * 1024
      ? `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
      : `${(totalBytes / 1024).toFixed(1)} KB`;

  const workspaces = await prisma.workspace.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-wider uppercase">
          <Sparkles className="h-3.5 w-3.5" /> Workspace Hub
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {session.user.name || "User"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your AI workspaces, conversations, and document context.
        </p>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Workspaces"
          value={workspaceCount}
          description="Active project spaces"
          icon={<FolderKanban className="h-5 w-5 text-indigo-500" />}
          badgeColor="bg-indigo-500/10"
        />
        <StatsCard
          title="AI Chats"
          value={chatCount}
          description="Conversations"
          icon={<MessageSquare className="h-5 w-5 text-sky-500" />}
          badgeColor="bg-sky-500/10"
        />
        <StatsCard
          title="Files"
          value={fileCount}
          description="Uploaded documents"
          icon={<Files className="h-5 w-5 text-emerald-500" />}
          badgeColor="bg-emerald-500/10"
        />
        <StatsCard
          title="Storage"
          value={storageFormatted}
          description="Context storage used"
          icon={<HardDrive className="h-5 w-5 text-amber-500" />}
          badgeColor="bg-amber-500/10"
        />
      </div>

      {/* Recent Workspaces List */}
      <RecentWorkspaces workspaces={workspaces} />
    </div>
  );
}