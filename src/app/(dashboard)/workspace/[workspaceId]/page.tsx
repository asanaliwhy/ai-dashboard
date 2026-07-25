import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditWorkspaceDialog } from "@/components/workspace/EditWorkspaceDialog";
import { DeleteWorkspaceDialog } from "@/components/workspace/DeleteWorkspaceDialog";
import { CreateChatDialog } from "@/components/chat/CreateChatDialog";
import { ChatCard } from "@/components/chat/ChatCard";
import { FileUploadSection } from "@/components/workspace/FileUploadSection";
import { MessageSquare, FileText, Calendar, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Workspace Detail Header Banner */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-1.5 opacity-90"
          style={{ backgroundColor: workspace.color }}
        />

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-bold text-white text-xl shadow-xs"
              style={{ backgroundColor: workspace.color }}
            >
              {workspace.name.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {workspace.name}
                </h1>
                <Badge variant="secondary" className="text-[11px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5">
                  Active
                </Badge>
              </div>

              <p className="text-xs md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {workspace.description || "No workspace description provided."}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/40 mt-3">
                <div className="flex items-center gap-1.5 font-medium">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {chats.length} {chats.length === 1 ? "Conversation" : "Conversations"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-medium">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {files.length} {files.length === 1 ? "Document" : "Documents"} Context
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px]">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>
                    Updated {new Date(workspace.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 shrink-0 self-start pt-1">
            <CreateChatDialog workspaceId={workspace.id} />
            <EditWorkspaceDialog
              workspace={{
                id: workspace.id,
                name: workspace.name,
                description: workspace.description,
                color: workspace.color,
              }}
            />
            <DeleteWorkspaceDialog
              workspaceId={workspace.id}
              workspaceName={workspace.name}
            />
          </div>
        </div>
      </div>

      {/* RAG Context Files Section */}
      <FileUploadSection workspaceId={workspace.id} initialFiles={files} />

      {/* Conversations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Conversations
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              AI chats created inside this workspace.
            </p>
          </div>
          <CreateChatDialog workspaceId={workspace.id} />
        </div>

        {chats.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-muted-foreground bg-card/30">
            <Sparkles className="mx-auto h-8 w-8 text-primary/60 mb-3" />
            <p className="font-semibold text-base text-foreground">
              No conversations in this workspace yet
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Start your first conversation with your configured AI model to begin brainstorming or querying workspace documents.
            </p>
            <div className="mt-5">
              <CreateChatDialog workspaceId={workspace.id} />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chats.map((chat: any) => (
              <ChatCard key={chat.id} chat={chat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}