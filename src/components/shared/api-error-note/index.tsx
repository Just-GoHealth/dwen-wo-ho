"use client";

import { formatCountdown } from "@just-gohealth/ui";
import { cn } from "@/lib/utils";
import type { DescribedApiError } from "@/lib/utils/shared/api-error";

/**
 * The backend's `detail` for a failed call, with the trace id in small print
 * on unexpected errors and the wait time on RATE_LIMITED.
 */
export function ApiErrorNote({
  error,
  secondsLeft = 0,
  className,
}: {
  error: DescribedApiError | null;
  secondsLeft?: number;
  className?: string;
}) {
  if (!error) return null;
  return (
    <div
      role="alert"
      className={cn(
        "text-destructive space-y-1 text-sm font-medium",
        className,
      )}
    >
      <p>{error.message}</p>
      {error.code === "RATE_LIMITED" && secondsLeft > 0 && (
        <p className="text-muted-foreground text-xs">
          Try again in {formatCountdown(secondsLeft)}
        </p>
      )}
      {error.traceId && (
        <p className="text-muted-foreground text-[11px] font-normal">
          Reference: {error.traceId}
        </p>
      )}
    </div>
  );
}
