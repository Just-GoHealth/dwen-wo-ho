import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors `SchoolCard`'s real layout (aspect image + overlapping logo row)
 * so the grid doesn't reflow when real cards load. */
export function SchoolCardSkeleton() {
  return (
    <div className="bg-card dark:bg-muted/80 border-border/30 w-full overflow-hidden rounded-lg border shadow-sm">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-3 pt-0">
        <div className="-mt-8 flex items-end gap-3">
          <Skeleton className="border-background h-16 w-16 shrink-0 rounded-full border-4" />
          <div className="min-w-0 flex-1 space-y-1.5 pb-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SchoolCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 pb-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SchoolCardSkeleton key={i} />
      ))}
    </div>
  );
}
