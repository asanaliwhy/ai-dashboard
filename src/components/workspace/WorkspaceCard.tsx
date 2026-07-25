"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditWorkspaceDialog } from "./EditWorkspaceDialog";

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
      <CardContent>
        <p>{workspace.chatCount} {workspace.chatCount === 1 ? "chat" : "chats"}</p>
        <p>Updated {workspace.updatedAt}</p>
        <Button>
            <Link href={`/workspace/${workspace.id}`}>Open</Link>
        </Button>
        <EditWorkspaceDialog workspace={workspace}  />
      </CardContent>
    </Card>
  );
}