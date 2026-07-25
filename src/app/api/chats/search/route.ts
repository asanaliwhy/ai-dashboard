import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const chats = await prisma.chat.findMany({
      where: {
        userId: session.user.id,
        title: {
          contains: query,
          mode: "insensitive",
        },
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
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
