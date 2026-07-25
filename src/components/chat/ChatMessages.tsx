"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Copy, Check, RefreshCw, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import "highlight.js/styles/github-dark.css";

type Message = {
  id: string;
  role: string;
  content: string;
  createdAt?: Date | string;
};

type ChatMessagesProps = {
  messages: Message[];
  status: "submitted" | "streaming" | "ready" | "error";
  onReload: () => void;
};

export function ChatMessages({
  messages,
  status,
  onReload,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-scroll while new messages arrive or content updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const copyToClipboard = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  if (messages.length === 0 && status === "ready") {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center space-y-3 max-w-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">No messages yet</h2>
          <p className="text-sm text-muted-foreground">
            Send your first message to start the conversation with the AI assistant.
          </p>
        </div>
      </div>
    );
  }

  const isThinking = status === "submitted";

  return (
    <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollContainerRef}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {messages.map((message, index) => {
          const isUser = message.role === "user" || message.role === "USER";
          const isLast = index === messages.length - 1;
          const isCopied = copiedId === message.id;

          return (
            <div
              key={message.id || index}
              className={`group flex gap-3 text-sm ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-medium">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`relative max-w-[85%] rounded-2xl px-4 py-3 shadow-xs ${
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-xs"
                    : "bg-muted text-foreground rounded-bl-xs border border-border/50"
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </p>
                ) : (
                  <div className="prose dark:prose-invert max-w-none break-words text-sm leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Message Actions */}
                <div
                  className={`mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 ${
                    isUser ? "justify-end text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md hover:bg-background/20"
                    onClick={() => copyToClipboard(message.id, message.content)}
                    title="Copy message"
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>

                  {!isUser && isLast && status === "ready" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-md hover:bg-background/20"
                      onClick={onReload}
                      title="Regenerate response"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-medium">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* AI is thinking indicator */}
        {isThinking && (
          <div className="flex gap-3 text-sm justify-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bot className="h-4 w-4 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-xs bg-muted px-4 py-3 border border-border/50">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" />
              </div>
              <span className="text-xs font-medium text-muted-foreground ml-1">
                AI is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}