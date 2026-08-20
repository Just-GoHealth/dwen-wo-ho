import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { SchoolDetailsErrorViewProps } from "@/lib/types/components/curator/school-details/school-details";

/** Mirrors the real page-content layout (top utility bar, patient grid,
 * bottom identity bar) so there's no layout jump when real data lands. */
export function SchoolDetailsLoadingView() {
  return (
    <div className="bg-app-gradient relative flex min-h-screen flex-col">
      <div className="flex w-full flex-1 flex-col px-4 py-6 pb-32 sm:px-6">
        <Skeleton className="mb-6 h-5 w-32" />

        <div className="mb-6 flex items-center gap-4 py-4">
          <Skeleton className="h-6 w-24 shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <Skeleton className="h-6 w-28" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 shrink-0 rounded-full" />
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>

      <div className="bg-[rgba(12,7,6,0.08)] backdrop-blur-xl">
        <div className="flex min-h-24 items-center justify-between px-8">
          <div>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-2 h-3 w-16" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SchoolDetailsErrorView({
  error,
  onBack,
}: SchoolDetailsErrorViewProps) {
  return (
    <div className="bg-muted/5 flex min-h-screen flex-col items-center justify-center p-6">
      <Button
        type="button"
        onClick={onBack}
        variant="ghost"
        className="text-muted-foreground hover:text-foreground mb-3"
      >
        ← Back to Schools
      </Button>
      <p className="text-destructive text-sm">{error || "School not found"}</p>
    </div>
  );
}
