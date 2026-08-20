"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading placeholder for the patient-detail screen — mirrors
 * `PatientDetailTopBar` and `AssessmentDomeTile`'s real layout (same
 * positions/breakpoints) so there's no layout jump when real data lands,
 * and the whole route no longer blocks behind a plain full-screen spinner.
 */
export function PatientDetailSkeleton() {
  return (
    <div className="bg-app-gradient relative flex h-dvh w-full flex-col overflow-hidden">
      <div className="relative flex shrink-0 flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:gap-3 sm:px-6 sm:py-5 md:px-10">
        <div className="flex w-full items-center justify-between gap-2 sm:contents">
          <div className="flex items-center gap-2">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
          </div>
          <Skeleton className="h-9 w-28 shrink-0 rounded-full sm:hidden" />
        </div>

        <div className="flex min-w-0 items-center justify-center gap-3 sm:absolute sm:top-1/2 sm:left-1/2 sm:order-2 sm:max-w-[60vw] sm:-translate-x-1/2 sm:-translate-y-1/2">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-col items-start gap-1.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <Skeleton className="hidden h-9 w-32 rounded-full sm:order-3 sm:ml-auto sm:block" />
      </div>

      <div className="flex min-h-full w-full flex-1 flex-col items-center justify-center gap-6 py-6">
        <div className="grid w-full max-w-[1600px] grid-cols-1 items-start gap-6 px-4 sm:grid-cols-3 sm:gap-8 sm:px-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={`dome-skeleton-${i}`}
              className="aspect-[2/1] w-full max-w-[420px] justify-self-center rounded-t-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
