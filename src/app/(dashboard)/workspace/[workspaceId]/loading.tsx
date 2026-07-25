import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceDetailLoading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-80" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 p-5 space-y-4 bg-card"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
