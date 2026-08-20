"use client";

import { m } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for the provider home screen's patient grid — mirrors
 * `PatientGridCard`'s real current layout exactly: same grid breakpoints
 * (1 col under 480px, 2 under 900px, 4 above), same glass card material
 * (`rounded-lg`, translucent border, backdrop blur), a 3-slot top row (NEW /
 * school pill / triage badge), a `size-20` face, and an Open-pill-shaped
 * placeholder — so the grid doesn't reflow or change material when real
 * cards load.
 */
export function ProviderDashboardSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 max-[480px]:grid-cols-1 min-[900px]:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <m.div
          key={`patient-grid-skeleton-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            delay: Math.min(i * 0.03, 0.15),
            ease: "easeOut",
          }}
          className="bg-card flex w-full flex-col items-center gap-1 rounded-lg border border-[rgba(255,255,255,.14)] px-[clamp(10px,1vw,16px)] pt-[clamp(11px,1.5vh,16px)] pb-[clamp(13px,1.8vh,19px)] text-center shadow-[0_4px_14px_rgba(0,0,0,.22)] backdrop-blur-[12px] backdrop-saturate-[1.2]"
        >
          <div className="grid min-h-[22px] w-full grid-cols-[1fr_auto_1fr] items-center gap-1.5">
            <Skeleton className="size-[22px] justify-self-start rounded-full" />
            <Skeleton className="h-4 w-14 justify-self-center rounded-full" />
            <Skeleton className="h-4 w-10 justify-self-end rounded-full" />
          </div>

          <Skeleton className="size-20 rounded-full" />

          <Skeleton className="mt-1 h-4 w-20" />
          <Skeleton className="h-3 w-16" />

          <Skeleton className="mt-[.35em] h-7 w-16 rounded-full" />
        </m.div>
      ))}
    </div>
  );
}
