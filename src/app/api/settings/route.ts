import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
  defaultModel: z.string().min(1),
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let settings = await prisma.settings.findUnique({
      where: { userId: session.user.id },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          userId: session.user.id,
          defaultModel: "Llama 3.3",
          theme: "SYSTEM",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET Settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updated = await prisma.settings.upsert({
      where: { userId: session.user.id },
      update: {
        defaultModel: parsed.data.defaultModel,
        theme: parsed.data.theme,
      },
      create: {
        userId: session.user.id,
        defaultModel: parsed.data.defaultModel,
        theme: parsed.data.theme,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
