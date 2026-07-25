"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { toast } from "sonner";
import type { Role } from "@prisma/client";

type ServerMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: Date | string;
};

type ChatContainerProps = {
  chatId: string;
  workspaceId: string;
  chatTitle: string;
  model: string;
  color: string;
  initialMessages: ServerMessage[];
};

export function ChatContainer({
  chatId,
  workspaceId,
  chatTitle,
  model,
  color,
  initialMessages,
}: ChatContainerProps) {
  const { messages, status, stop, regenerate, sendMessage } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({
      api: `/api/chat/${chatId}`,
    }),
    messages: initialMessages.map((m) => ({
      id: m.id,
      role: m.role.toLowerCase() as "user" | "assistant" | "system",
      parts: [{ type: "text" as const, text: m.content }],
    })),
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong while generating response"
      );
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleSend = async (content: string) => {
    await sendMessage({
      text: content,
    });
  };

  const formattedMessages = messages.map((m) => {
    let textContent = "";
    if (m.parts && Array.isArray(m.parts)) {
      textContent = m.parts
        .filter((p: unknown) => (p as { type?: string }).type === "text")
        .map((p: unknown) => (p as { text?: string }).text || "")
        .join("");
    } else if ("content" in m && typeof (m as { content?: unknown }).content === "string") {
      textContent = (m as { content: string }).content;
    }

    return {
      id: m.id,
      role: m.role,
      content: textContent,
    };
  });

  return (
    <div className="flex h-full flex-col bg-background overflow-hidden">
      <ChatHeader
        chatId={chatId}
        workspaceId={workspaceId}
        chatTitle={chatTitle}
        model={model}
        color={color}
      />

      <ChatMessages
        messages={formattedMessages}
        status={status}
        onReload={regenerate}
      />

      <ChatInput
        onSend={handleSend}
        onStop={stop}
        isLoading={isLoading}
      />
    </div>
  );
}
