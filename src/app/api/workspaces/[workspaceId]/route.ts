import {auth} from "@/auth";
import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";
import { workspaceSchema} from "@/lib/workspaceValidation";

type RouteContext = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export async function DELETE (request: Request, { params }: RouteContext) {
    try{
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({error:"Unauthorized"}, {status:401});
        }
        const user = await prisma.user.findUnique({where: {email: session.user.email}});
        if (!user) {
            return NextResponse.json({error:"Unauthorized"}, {status:401});
        }
        const {workspaceId} = await params;
        const workspace = await prisma.workspace.findFirst({
            where: {
                id: workspaceId,
                userId: user.id,
            },
        })
        if (!workspace){
            return NextResponse.json({error: "Workspace not found"}, {status:404});
        }
        await prisma.workspace.delete({
            where: {
                id: workspaceId,
            },
        });
        return NextResponse.json({message: "Workspace deleted"}, {status:200});
    } catch{
        return NextResponse.json({error: "Failed to delete workspace"}, {status:500});
    }
}

export async function PUT( request: Request,  { params }: RouteContext) {
    try{
        const session = await auth();
        if (!session?.user?.email){
            return NextResponse.json({error:"Unauthorized"}, {status:401});
        }
        const user = await prisma.user.findUnique({where: {email: session.user.email}});
        if (!user){
            return NextResponse.json({error:"Unauthorized"}, {status:401});
        }
        const {workspaceId} = await params;
        const body = await request.json();
        const validatedFields = workspaceSchema.safeParse(body);
        if (!validatedFields.success){
            return NextResponse.json({error:"Invalid workspace data"}, {status:400})
        }
        const { name, description, color} = validatedFields.data;
        const workspace = await prisma.workspace.findFirst({
            where: {
                id: workspaceId,
                userId: user.id
            }
        });
        if (!workspace){
            return NextResponse.json({error:"Workspace not found"}, {status:404})
        }
        const updatedWorkspace = await prisma.workspace.update({
            where: {
                id: workspaceId,
            },
            data: {
                name,
                description,
                color,
            }
        })
        return NextResponse.json(updatedWorkspace, {status: 200});
    } catch{
        return NextResponse.json({error: "Failed to update workspace"}, {status:500});
    }
}