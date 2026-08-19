"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProviderGlassBarProps {
  /** Left region — e.g. section label + logout action. */
  left?: ReactNode;
  /** Center region — provider identity (avatar, name, verified badge). Sits
   * left-aligned next to the `left` region, matching the reference mockup's
   * identity cluster hugging the bar's left edge. */
  center: ReactNode;
  /** Right region — e.g. triage filter chips, logo. */
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
      <div className="relative flex w-full flex-col items-center justify-center gap-2 px-4 py-3 sm:min-h-24 sm:flex-row sm:items-center sm:justify-start sm:gap-4 sm:px-8 md:min-h-28 md:px-14 lg:min-h-32 lg:px-20">
        {left && (
          <div className="flex shrink-0 items-center gap-3 sm:order-1">
            {left}
          </div>
        )}
        <div className="flex min-w-0 items-center justify-center gap-4 overflow-hidden sm:order-2 sm:max-w-[62vw] sm:min-w-0 sm:flex-1 sm:justify-start">
          {center}
        </div>
        {right && (
          <div className="flex shrink-0 items-center gap-4 sm:order-3 sm:ml-auto">
            {right}
          </div>
        )}
      </div>
    </div>
  );
}
