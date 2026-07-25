import { WorkspaceSidebar } from "@/components/sidebar/WorkspaceSidebar";
import { Topbar } from "./Topbar";

type DashboardShellProps = {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  workspaces: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

export function DashboardShell({
  children,
  user,
  workspaces,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <WorkspaceSidebar workspaces={workspaces} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar user={user} />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}