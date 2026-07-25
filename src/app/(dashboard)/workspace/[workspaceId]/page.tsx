import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditWorkspaceDialog } from "@/components/workspace/EditWorkspaceDialog";
import { CreateChatDialog } from "@/components/chat/CreateChatDialog";
import { ChatCard } from "@/components/chat/ChatCard";
import { FileUploadSection } from "@/components/workspace/FileUploadSection";

type WorkspaceDetailPageProps = {
  params: Promise<{ workspaceId: string }>;
};

export default async function WorkspaceDetailPage({
  params,
}: WorkspaceDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { workspaceId } = await params;

  const workspace = await (prisma.workspace as any).findFirst({
    where: {
      id: workspaceId,
      userId: session.user.id,
    },
    include: {
      chats: {
        orderBy: {
          updatedAt: "desc",
        },
      },
      files: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!workspace) {
    notFound();
  }

  const chats = (workspace.chats || []).map((chat: any) => ({
    id: chat.id,
    title: chat.title,
    aiModel: chat.aiModel,
    workspaceId: workspace.id,
    updatedAt: new Date(chat.updatedAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));

  const files = (workspace.files || []).map((file: any) => ({
    id: file.id,
    name: file.name,
    url: file.url,
    size: file.size,
    type: file.type,
    createdAt: file.createdAt,
  }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-16 rounded-2xl shrink-0 shadow-md flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: workspace.color }}
          >
            {workspace.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {workspace.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {workspace.description || "No description provided."}
            </p>
          </div>
        </div>

        <EditWorkspaceDialog
          workspace={{
            id: workspace.id,
            name: workspace.name,
            description: workspace.description,
            color: workspace.color,
          }}
        />
      </div>

      {/* RAG Preparation & Files Section */}
      <FileUploadSection workspaceId={workspace.id} initialFiles={files} />

      {/* Chats Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Conversations ({chats.length})
          </h2>
          <CreateChatDialog workspaceId={workspace.id} />
        </div>

        {chats.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            No chats in this workspace yet. Click &quot;Create Chat&quot; to begin.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {chats.map((chat: any) => (
              <ChatCard key={chat.id} chat={chat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}