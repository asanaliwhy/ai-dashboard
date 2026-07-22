export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Projects</h3>
          <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">12</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Tasks</h3>
          <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">48</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Completed Tasks</h3>
          <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">189</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Team Members</h3>
          <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">8</p>
        </div>
      </div>
    </div>
  );
}
