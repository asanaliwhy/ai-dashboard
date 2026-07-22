import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar placeholder */}
      <aside className="w-64 border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 hidden md:block">
        <div className="h-8 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
      </aside>
      <div className="flex-1 flex flex-col">
        {/* Navbar placeholder */}
        <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-900">
          <div className="h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
        </header>
        <main className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  );
}
