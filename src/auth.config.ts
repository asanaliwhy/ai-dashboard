import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import {loginSchema} from "@/lib/loginValidation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authConfig = {
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    callbacks:{
        authorized({auth, request: {nextUrl}}){
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            if (isOnDashboard){
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn){
                return Response.redirect(new URL("/dashboard", nextUrl));
            }
            return true;
        },
    },
   providers: [
    Credentials({
        async authorize(credentials){
            const validatedFields = loginSchema.safeParse(credentials);
            if (!validatedFields.success) return null;
            const {email, password} = validatedFields.data;
            const user = await prisma.user.findUnique({where: {email}});
            if (!user) return null;
            const passwordMatch = await bcrypt.compare(password, user.password);

            
            if (passwordMatch){
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            }
            return null;
        }
    })
   ]
} satisfies NextAuthConfig