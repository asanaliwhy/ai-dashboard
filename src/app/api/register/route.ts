import { NextResponse } from "next/server";
import { registerSchema} from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);
    if (!result.success) {

      return NextResponse.json(
        {
          error: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }
    const existingUser = await prisma.user.findUnique({
        where: {
            email: result.data.email,
        }
    })

    if (existingUser){
        return NextResponse.json({
            error: "Email already exists",
        },{
            status: 409,
        })
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    const user = await prisma.user.create({
  data: {
    name: result.data.name,
    email: result.data.email,
    password: hashedPassword,

    setting: {
      create: {
        theme: "SYSTEM",
        defaultModel: "llama-3.3",
      },
    },
  },
});

    


    return NextResponse.json(
      {
        id: user.id,
    name: user.name,
    email: user.email,
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}