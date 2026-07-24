import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { workspaceSchema } from "@/lib/workspaceValidation";

export async function GET(request: Request) {
  try {
    const session = await auth();
  if (!session?.user?.email){
    return NextResponse.json({error:"Unauthorized"}, {status: 401})
  }
   const user = await prisma.user.findUnique({where: {email: session.user.email}});
   if (!user){
    return NextResponse.json({error:"Unauthorized"}, {status: 401})
   }
    const workspaces = await prisma.workspace.findMany({where: {userId: user.id}, orderBy: {updatedAt: "desc"}});
    return NextResponse.json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json({ error: "Failed to fetch workspaces" }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
    if (!session?.user?.email){
        return NextResponse.json({error:"Unauthorized"}, {status: 401})
    }
     const user = await prisma.user.findUnique({where: {email: session.user.email}});
     if (!user){
        return NextResponse.json({error:"Unauthorized"}, {status: 401})
     }
        const body = await request.json();
        const result = workspaceSchema.safeParse(body);
        if (!result.success){
            return NextResponse.json({error: result.error.flatten()}, {status: 400})
        }
        const workspace = await prisma.workspace.create({ data: {...result.data, userId: user.id} });
        return NextResponse.json(workspace);
    } catch (error) {
        console.error("Error creating workspace:", error);
        return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
    }
}

