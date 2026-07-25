import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/chatMessageValidation";
import { updateChatSchema } from "@/lib/chatValidation";
import { models } from "@/lib/groq";
import { streamText } from "ai";

type RouteParams = {
  params: Promise<{
    chatId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: RouteParams
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { chatId } = await params;

    const body = await request.json();

    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: session.user.id,
      },
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    const model = models[chat.aiModel as keyof typeof models];

    if (!model) {
      return NextResponse.json(
        { error: "Invalid AI model" },
        { status: 400 }
      );
    }

    await prisma.message.create({
      data: {
        chatId,
        role: "USER",
        content: result.data.content,
      },
    });

    const history = await prisma.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const aiMessages = history.map((m) => ({
      role:
        m.role === "USER"
          ? ("user" as const)
          : ("assistant" as const),
      content: m.content,
    }));

    const streamResult = streamText({
      model,
      messages: aiMessages,
      onFinish: async ({ text }) => {
        await prisma.message.create({
          data: {
            chatId,
            role: "ASSISTANT",
            content: text,
          },
        });
      },
    });

    return streamResult.toTextStreamResponse();
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { chatId } = await params;

    const body = await request.json();

    const result = updateChatSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    const updatedChat = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: result.data,
    });

    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update chat" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { chatId } = await params;

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });

    return NextResponse.json({
      success: true,
      id: chatId,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 }
    );
  }
}