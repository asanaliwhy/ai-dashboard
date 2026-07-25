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
        <div className="text-center space-y-3 max-w-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            How can I assist you today?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ask a question, request code generation, or summarize document context.
          </p>
        </div>
      </div>
    );
  }

  const isThinking = status === "submitted";

  return (
    <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollContainerRef}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-4">
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
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-medium shadow-xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div className="flex flex-col gap-1 max-w-[85%] md:max-w-[78%]">
                <div
                  className={`relative rounded-2xl px-4 py-2.5 shadow-xs ${
                    isUser
                      ? "bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground dark:border dark:border-border/60 rounded-2xl rounded-tr-sm font-normal"
                      : "bg-card text-card-foreground rounded-2xl rounded-tl-sm border border-border/60"
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap break-words leading-relaxed text-sm">
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
                </div>

                {/* Actions bar (outside bubble, visible on hover) */}
                <div
                  className={`flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 px-1 text-muted-foreground ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md hover:bg-accent hover:text-foreground"
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
                      className="h-6 w-6 rounded-md hover:bg-accent hover:text-foreground"
                      onClick={onReload}
                      title="Regenerate response"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground font-medium shadow-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* AI is thinking state */}
        {isThinking && (
          <div className="flex gap-3 text-sm justify-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bot className="h-4 w-4 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-xs bg-card px-5 py-3.5 border border-border/60 shadow-xs">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" />
              </div>
              <span className="text-xs font-medium text-muted-foreground ml-1.5">
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