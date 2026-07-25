"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
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
    <div className="border-t bg-background p-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-4xl items-end gap-3"
      >
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for newline)"
            disabled={isLoading}
            className="min-h-[44px] max-h-[200px] resize-none overflow-y-auto py-3 pr-4"
          />
        </div>

        {isLoading ? (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={onStop}
            className="h-[44px] w-[44px] shrink-0 rounded-xl"
            title="Stop generation"
          >
            <Square className="h-4 w-4 fill-current" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!content.trim()}
            className="h-[44px] w-[44px] shrink-0 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  );
}