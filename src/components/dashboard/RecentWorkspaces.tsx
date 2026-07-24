import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card";
import { FolderPlus } from "lucide-react";
import { CreateWorkspaceDialog } from "../workspace/CreateWorkspaceDialog";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface RecentWorkspacesProps {
    workspaces: {
        id: string,
        name: string,
        color: string,
        updatedAt: Date,
    }[];
}

export async function RecentWorkspaces({workspaces}: RecentWorkspacesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1">
        <FolderPlus className="h-10 w-10 text-muted-foreground" />
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground">Recent Workspaces</CardTitle>
      </CardHeader>
      {workspaces.length === 0 ? (
        <CardContent className="space-y-4">
          <CardDescription>No workspaces yet. Create your first workspace to start organizing your AI projects.</CardDescription>
          <CreateWorkspaceDialog />
        </CardContent>
      ): (
        <CardContent>
          <div className="space-y-2">
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-md"
                    style={{ backgroundColor: workspace.color }}
                  />
                  <span className="font-medium text-foreground">{workspace.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(workspace.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}