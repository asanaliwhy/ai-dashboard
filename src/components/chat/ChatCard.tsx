"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

type ChatCardProps = {
  chat: {
    id: string;
    title: string;
    aiModel: string;
    updatedAt: string;
    workspaceId: string;
  };
};

export function ChatCard({ chat }: ChatCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />

          <div>
            <CardTitle>{chat.title}</CardTitle>
            <CardDescription>{chat.aiModel}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Updated {chat.updatedAt}
        </p>

        <Link
          href={`/workspace/${chat.workspaceId}/chat/${chat.id}`}
          className={buttonVariants({ className: "w-full" })}
        >
          Open Chat
        </Link>
      </CardContent>
    </Card>
  );
}