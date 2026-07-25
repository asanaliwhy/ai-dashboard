import { auth } from "@/auth";
import { redirect, notFound} from "next/navigation";
import { prisma } from "@/lib/prisma";
import {EditWorkspaceDialog} from "@/components/workspace/EditWorkspaceDialog";

type WorkspaceDetailPageProps = {
  params: Promise<{ workspaceId: string }>;
};

export default async function WorkspaceDetailPage ({ params }: WorkspaceDetailPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const { workspaceId } = await params;
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      userId: session.user.id,
    },
    include: {
      chats: {
        orderBy:{
            updatedAt: "desc"
        }
      }
    },
  });
  if (!workspace) {
    notFound();
  }
  return (
    <div className="space-y-8">
      <div>
        <div
          className="mb-4 h-16 w-16 rounded-xl"
          style={{ backgroundColor: workspace.color }}
        />

        <h1 className="text-3xl font-bold">
          {workspace.name}
        </h1>

        <p className="text-muted-foreground">
          {workspace.description || "No description"}
        </p>
      </div>

      <EditWorkspaceDialog
    workspace={{
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      color: workspace.color,
    }}
  />

      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Chats
        </h2>

        {workspace.chats.length === 0 ? (
          <p className="text-muted-foreground">
            No chats yet.
          </p>
        ) : (
          <div className="space-y-2">
            {workspace.chats.map((chat) => (
              <div
                key={chat.id}
                className="rounded-lg border p-4"
              >
                {chat.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}