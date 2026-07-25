export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workspace/:path*",
    "/chat/:path*",
    "/settings/:path*",
    "/profile/:path*",
  ],
};