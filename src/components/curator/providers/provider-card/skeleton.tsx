import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors `ProviderCard`'s real layout (centered avatar, name, subtitle,
 * action row) so the grid doesn't reflow when real cards load. */
export function ProviderCardSkeleton() {
  return (
    <div className="bg-card border-border flex w-full flex-col items-center rounded-xl border p-6 shadow-sm">
      <Skeleton className="mb-4 size-16 rounded-full" />
      <Skeleton className="mb-2 h-5 w-32" />
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
}

export function ProviderCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProviderCardSkeleton key={i} />
      ))}
    </div>
  );
}
