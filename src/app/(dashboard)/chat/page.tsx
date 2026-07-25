import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ChatIndexPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Find the user's most recent chat
  const latestChat = await prisma.chat.findFirst({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      workspaceId: true,
    },
  });

  if (latestChat) {
    redirect(`/workspace/${latestChat.workspaceId}/chat/${latestChat.id}`);
  }

  // Find most recent workspace if no chats exist
  const latestWorkspace = await prisma.workspace.findFirst({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
    },
  });

  if (latestWorkspace) {
    redirect(`/workspace/${latestWorkspace.id}`);
  }

  redirect("/workspace");
}