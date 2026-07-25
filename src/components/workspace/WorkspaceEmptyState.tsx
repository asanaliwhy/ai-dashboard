import {Card, CardDescription, CardTitle} from "@/components/ui/card";
import {FolderPlus} from "lucide-react";
import {CreateWorkspaceDialog} from "./CreateWorkspaceDialog";

export function WorkspaceEmptyState () {
    return (
<Card className="flex flex-col items-center justify-center p-10 text-center">
  <FolderPlus className="mb-4 h-12 w-12 text-muted-foreground" />

  <CardTitle>No workspaces yet</CardTitle>

  <CardDescription>
    Create your first workspace to begin organizing your AI projects.
  </CardDescription>

  <div className="mt-6">
    <CreateWorkspaceDialog />
  </div>
</Card>
    )
}