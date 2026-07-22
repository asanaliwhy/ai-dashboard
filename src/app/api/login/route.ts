import { NextResponse } from "next/server";
import { loginSchema} from "@/lib/loginValidation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);

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

    const user = await prisma.user.findUnique({
  where: {
    email: result.data.email,
  },
});
      if (!user){
        return NextResponse.json({
            error: "Invalid email or password"
        },{
            status: 401,
        })
      }

      const passwordMatch = await bcrypt.compare(result.data.password, user.password);
      if (!passwordMatch){
        return NextResponse.json({
            error: "Invalid email or password"
        },{
            status: 401,
        })
      }
    
      return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      {
        status: 200,
      }
    );
  } catch {
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