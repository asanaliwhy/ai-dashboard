export default function ChatPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">AI Chat</h1>
      </div>
      <div className="flex flex-col h-[500px] rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs dark:bg-zinc-50 dark:text-zinc-900">AI</div>
            <div className="rounded-lg bg-zinc-100 p-3 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">Hello! How can I help you in your workspace today?</div>
          </div>
        </div>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
      </div>
    </div>
  );
}
