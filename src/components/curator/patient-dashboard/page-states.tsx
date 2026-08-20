import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PatientDetailsErrorViewProps } from "@/lib/types/components/curator/patient-dashboard";

/** Mirrors `PatientDetailsPageContent`'s real layout (header, 2-col
 * metrics/actions grid) so there's no layout jump when real data lands. */
export function PatientDetailsLoadingView() {
  return (
    <div className="bg-muted/5 flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </main>
    </div>
  );
}

export function PatientDetailsErrorView({
  onBack,
}: PatientDetailsErrorViewProps) {
  return (
    <div className="bg-muted/5 flex min-h-screen flex-col items-center justify-center p-6">
      <Button
        type="button"
        onClick={onBack}
        variant="ghost"
        className="text-muted-foreground hover:text-foreground mb-3 flex items-center gap-1 text-sm"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </Button>
      <p className="text-destructive text-sm">Failed to load patient details</p>
    </div>
  );
}
