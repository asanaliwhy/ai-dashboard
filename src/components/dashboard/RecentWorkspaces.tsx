import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FolderKanban, ArrowRight, Clock } from "lucide-react";
import { CreateWorkspaceDialog } from "../workspace/CreateWorkspaceDialog";

interface RecentWorkspacesProps {
  workspaces: {
    id: string;
    name: string;
    color: string;
    updatedAt: Date;
  }[];
}

export function RecentWorkspaces({ workspaces }: RecentWorkspacesProps) {
  return (
    <Card className="border border-border/60 bg-card p-6 shadow-xs">
      <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between border-b border-border/40">
        <div>
          <CardTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Recent Workspaces
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Quickly jump back into your active workspaces.
          </CardDescription>
        </div>

        {workspaces.length > 0 && (
          <Link
            href="/workspace"
            className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-medium hover:bg-accent transition-colors"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </CardHeader>

      {workspaces.length === 0 ? (
        <CardContent className="p-0 pt-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FolderKanban className="h-6 w-6" />
          </div>
          <CardDescription className="text-xs max-w-sm mx-auto">
            No workspaces created yet. Create your first workspace to organize your AI conversations.
          </CardDescription>
          <div className="pt-2">
            <CreateWorkspaceDialog />
          </div>
        </CardContent>
      ) : (
        <CardContent className="p-0 pt-3 divide-y divide-border/40">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/workspace/${workspace.id}`}
              className="flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-accent/60 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-xs transition-transform group-hover:scale-105"
                  style={{ backgroundColor: workspace.color }}
                >
                  {workspace.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {workspace.name}
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    Updated {new Date(workspace.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </CardContent>
      )}
    </Card>
  );
}