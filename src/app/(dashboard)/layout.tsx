import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const workspaces = await prisma.workspace.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, color: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <DashboardShell user={session.user} workspaces={workspaces}>
      {children}
    </DashboardShell>
  );
}
