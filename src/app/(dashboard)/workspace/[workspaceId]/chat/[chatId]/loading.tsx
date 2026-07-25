import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Loading content</h2>
        <p className="text-sm text-muted-foreground">Please wait while we set things up for you.</p>
      </div>
    </div>
  );
}
