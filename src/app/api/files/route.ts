import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createFileSchema = z.object({
  name: z.string().min(1, "File name is required"),
  url: z.string().min(1, "File URL or path is required"),
  size: z.number().optional().default(0),
  type: z.string().optional().default("document"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID required" },
        { status: 400 }
      );
    }

    const files = await prisma.file.findMany({
      where: {
        workspaceId,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("GET files error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = createFileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid file data" },
        { status: 400 }
      );
    }

    // Verify user owns the workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: result.data.workspaceId,
        userId: session.user.id,
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const file = await prisma.file.create({
      data: {
        name: result.data.name,
        url: result.data.url,
        size: result.data.size,
        type: result.data.type,
        workspaceId: result.data.workspaceId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    console.error("POST file error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("id");

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID required" },
        { status: 400 }
      );
    }

    const deleteResult = await prisma.file.deleteMany({
      where: {
        id: fileId,
        userId: session.user.id,
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "File not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id: fileId });
  } catch (error) {
    console.error("DELETE file error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
