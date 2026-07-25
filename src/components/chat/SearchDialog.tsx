"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MessageSquare, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type SearchResult = {
  id: string;
  title: string;
  aiModel: string;
  updatedAt: string;
  workspace: {
    id: string;
    name: string;
    color: string;
  };
  messages: Array<{ content: string }>;
};

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/chats/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (workspaceId: string, chatId: string) => {
    onOpenChange(false);
    router.push(`/workspace/${workspaceId}/chat/${chatId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-sm font-normal text-muted-foreground flex items-center gap-2">
            <Search className="h-4 w-4" /> Search Chats
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-3 border-b">
          <Input
            placeholder="Type to search chats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 text-base"
            autoFocus
          />
        </div>

        <div className="max-h-[350px] overflow-y-auto p-2">
          {loading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Searching...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No chats found matching &quot;{query}&quot;
            </div>
          )}

          {!loading && !query && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Start typing to search your AI conversations...
            </div>
          )}

          {!loading &&
            results.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelect(chat.workspace.id, chat.id)}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <div
                  className="h-8 w-8 rounded-md shrink-0 flex items-center justify-center text-white"
                  style={{ backgroundColor: chat.workspace.color }}
                >
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{chat.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {chat.workspace.name}
                    </span>
                  </div>
                  {chat.messages?.[0] && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {chat.messages[0].content}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
