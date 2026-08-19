"use client";

import { m } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for notification items in the notification sheet.
 * Mimics the notification card layout with avatar, content, and actions.
 */
export function NotificationSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2 py-4">
      {Array.from({ length: count }).map((_, i) => (
        <m.div
          key={`notif-skeleton-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            delay: Math.min(i * 0.05, 0.3),
            ease: "easeOut",
          }}
          className="border-border bg-card relative flex items-start gap-3 rounded-xl border p-4"
        >
          {/* Avatar skeleton */}
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

          {/* Content skeleton */}
          <div className="min-w-0 flex-1 space-y-2">
            {/* Title row */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-2 rounded-full" />
            </div>
            {/* Message row */}
            <Skeleton className="h-3.5 w-full" />
            {/* Meta row */}
            <Skeleton className="h-3 w-16" />
          </div>

          {/* Actions skeleton */}
          <div className="flex shrink-0 flex-col gap-1">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </m.div>
      ))}
    </div>
  );
}
