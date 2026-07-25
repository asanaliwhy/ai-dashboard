import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";
import { WorkspaceEmptyState } from "@/components/workspace/WorkspaceEmptyState";


export default async function WorkspacePage (){
  const session = await auth();
  if (!session?.user){
    redirect("/login");
  }
  const workspaces = await prisma.workspace.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      chats: true,
    },
    orderBy:{
      updatedAt: "desc"
    }
  })

  const formattedData = workspaces.map(workspace => ({
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
  }))

  if (formattedData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <WorkspaceEmptyState/>
      </div>
    );
  }
  
  return (
    <>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Workspaces</h1>
        <p className="text-muted-foreground">
          Manage all of your AI workspaces.
        </p>
      </div>
      <CreateWorkspaceDialog />
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {formattedData.map(workspace => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
    </>
  );
}
