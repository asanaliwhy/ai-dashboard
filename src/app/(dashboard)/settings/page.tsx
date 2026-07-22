export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Settings</h1>
      </div>
      <div className="max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">General Settings</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Configure application and profile preferences.</p>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">Email Notifications</p>
              <p className="text-xs text-zinc-500">Receive summaries and updates about your work.</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-zinc-300 dark:border-zinc-700" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">Dark Mode</p>
              <p className="text-xs text-zinc-500">Enable modern dark interface styling.</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-zinc-300 dark:border-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
