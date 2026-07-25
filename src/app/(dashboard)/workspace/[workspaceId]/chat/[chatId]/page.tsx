import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { ChatContainer } from "@/components/chat/ChatContainer";

type WorkspaceChatPageProps = {
  params: Promise<{
    workspaceId: string;
    chatId: string;
  }>;
};

export default async function WorkspaceChatPage({
  params,
}: WorkspaceChatPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { workspaceId, chatId } = await params;

  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      workspaceId,
      userId: session.user.id,
    },
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!chat) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col">
      <ChatContainer
        chatId={chat.id}
        workspaceId={chat.workspace.id}
        chatTitle={chat.title}
        model={chat.aiModel}
        color={chat.workspace.color}
        initialMessages={chat.messages}
      />
    </div>
  );
}
