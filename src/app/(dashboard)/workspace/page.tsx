export default function WorkspacePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Workspace</h1>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Your Workspace</h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Manage your documents, settings, and team collaboration here.</p>
      </div>
    </div>
  );
}
