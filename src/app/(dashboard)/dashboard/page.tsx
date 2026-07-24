import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1>Welcome back {session?.user?.name}</h1>

      <p>{session?.user?.email}</p>
    </div>
  );
}