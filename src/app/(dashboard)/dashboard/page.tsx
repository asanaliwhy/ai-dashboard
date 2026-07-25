import { auth } from "@/auth";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FolderKanban, MessageSquare, Files, HardDrive } from "lucide-react";
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
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {session.user.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your AI workspaces and recent activities here.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Workspaces"
          value={workspaceCount}
          description="Total workspaces"
          icon={<FolderKanban className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="AI Chats"
          value={chatCount}
          description="Conversations"
          icon={<MessageSquare className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Files"
          value={fileCount}
          description="Uploaded files"
          icon={<Files className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Storage"
          value={storageFormatted}
          description="Storage used"
          icon={<HardDrive className="h-6 w-6 text-primary" />}
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Recent Workspaces
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your AI workspaces and recent activity.
          </p>
          <RecentWorkspaces workspaces={workspaces} />
        </div>
      </div>
    </div>
  );
}