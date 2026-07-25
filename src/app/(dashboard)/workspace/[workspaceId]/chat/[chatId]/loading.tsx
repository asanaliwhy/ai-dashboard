import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-16 w-full items-center justify-between border-b border-border/60 px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 max-w-4xl mx-auto w-full">
        <div className="flex justify-end">
          <Skeleton className="h-12 w-2/3 rounded-2xl rounded-br-xs" />
        </div>
        <div className="flex justify-start gap-3">
          <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
          <Skeleton className="h-24 w-3/4 rounded-2xl rounded-bl-xs" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-1/2 rounded-2xl rounded-br-xs" />
        </div>
      </div>
    </div>
  );
}
