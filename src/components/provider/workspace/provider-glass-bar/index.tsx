"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProviderGlassBarProps {
  /** Left region — provider identity (avatar, name, verified badge). */
  left?: ReactNode;
  /** Center region — e.g. triage filter chips. Sits genuinely centered on
   * the bar (a 3-column grid, not a flex row), so its position never shifts
   * with how wide `left`/`right` happen to be. Omitted entirely on screens
   * with no middle content (e.g. patient detail, which only needs identity
   * + logo). */
  center?: ReactNode;
  /** Right region — e.g. logo. */
  right?: ReactNode;
  className?: string;
}

/**
 * Dark frosted glass bottom identity/action bar for the provider home and
 * patient detail screens — plain CSS `backdrop-blur` + a light tint, no
 * custom SVG displacement filter in the way (that's what `LiquidGlass`
 * adds, and it can suppress the backdrop-blur actually compositing in some
 * browsers). Content scrolling underneath (this bar is absolutely
 * positioned by the caller, overlaying the scrollable roll) should read as
 * genuinely blurred/see-through, not flat or invisible.
 */
export function ProviderGlassBar({
  left,
  center,
  right,
  className,
}: ProviderGlassBarProps) {
  return (
    <div
      className={cn(
        "relative z-40 w-full bg-[rgba(12,7,6,0.08)] backdrop-blur-xl backdrop-saturate-150",
        className,
      )}
    >
      <div className="relative flex w-full flex-row items-center gap-2 px-4 py-3 sm:grid sm:min-h-24 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:gap-4 sm:px-8 md:min-h-28 md:px-14 lg:min-h-32 lg:px-20">
        {left && (
          <div className="flex min-w-0 shrink-0 items-center gap-3 overflow-hidden sm:order-1 sm:min-w-0 sm:justify-self-start">
            {left}
          </div>
        )}
        {center && (
          <div
            className={cn(
              "flex shrink-0 items-center justify-center gap-4 sm:order-2 sm:ml-0 sm:justify-self-center",
              left && "ml-auto",
            )}
          >
            {center}
          </div>
        )}
        {right && (
          <div
            className={cn(
              "flex shrink-0 items-center gap-4 sm:order-3 sm:ml-0 sm:justify-self-end",
              !center && "ml-auto",
            )}
          >
            {right}
          </div>
        )}
      </div>
    </div>
  );
}
