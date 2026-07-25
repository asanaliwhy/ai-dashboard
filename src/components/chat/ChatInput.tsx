"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square, Paperclip, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatInputProps = {
  onSend: (content: string) => Promise<void>;
  onStop: () => void;
  isLoading: boolean;
};

export function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [content]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    setContent("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await onSend(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 md:px-6 md:pb-6 bg-background">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-4xl flex-col rounded-2xl border border-border/60 bg-card p-3 shadow-sm transition-all focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10"
      >
        <Textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or request code generation... (Shift+Enter for newline)"
          disabled={isLoading}
          className="min-h-[44px] max-h-[200px] resize-none border-none shadow-none focus-visible:ring-0 text-sm py-2 px-3 placeholder:text-muted-foreground/60"
        />

        <div className="flex items-center justify-between pt-2 px-2 border-t border-border/40">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Attach context file"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <span className="hidden sm:inline text-[11px]">
              Context enabled
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] text-muted-foreground font-mono">
              ⌘ Enter to send
            </span>

            {isLoading ? (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={onStop}
                className="h-8 gap-1.5 px-3 rounded-xl text-xs font-medium"
              >
                <Square className="h-3.5 w-3.5 fill-current" /> Stop
              </Button>
            ) : (
              <Button
                type="submit"
                size="sm"
                disabled={!content.trim()}
                className="h-8 gap-1.5 px-3 rounded-xl text-xs font-medium"
              >
                Send <Send className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}