import { NextResponse } from "next/server";
import { createChatSchema } from "@/lib/chatValidation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = createChatSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      );
    }
    const workspace = await prisma.workspace.findFirst({
      where: { id: result.data.workspaceId, userId: session.user.id },
    });
    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }
    const chat = await prisma.chat.create({
      data: {
        title: result.data.title,
        workspaceId: workspace.id,
        aiModel: result.data.aiModel,
        userId: session.user.id,
      },
    });
    return NextResponse.json(chat, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
