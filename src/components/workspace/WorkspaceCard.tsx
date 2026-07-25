"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditWorkspaceDialog } from "./EditWorkspaceDialog";
import { DeleteWorkspaceDialog } from "./DeleteWorkspaceDialog";

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

export default function WorkspaceCard({workspace}: WorkspaceCardProps){
  return (
    <Card>
      <CardHeader>
        <div className="h-24 w-full rounded-lg"   style={{backgroundColor: workspace.color}}></div>
        <CardTitle>{workspace.name}</CardTitle>
        <CardDescription>{workspace.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{workspace.chatCount} {workspace.chatCount === 1 ? "chat" : "chats"}</p>
        <p className="text-sm text-muted-foreground">Updated {workspace.updatedAt}</p>
        <Button variant="outline" className="w-full flex gap-2">
            <Link href={`/workspace/${workspace.id}`}>Open</Link>
        </Button>
        <EditWorkspaceDialog workspace={workspace}  />
        <DeleteWorkspaceDialog workspaceId={workspace.id} workspaceName={workspace.name} />
      </CardContent>
    </Card>
  );
}