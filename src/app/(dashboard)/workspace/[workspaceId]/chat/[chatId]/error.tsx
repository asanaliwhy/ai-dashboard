"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">
          An error occurred while loading this page. Please try refreshing or click the button below.
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
