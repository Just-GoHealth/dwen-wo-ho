"use client";

import type { ReactNode } from "react";
import { ClientOnly } from "@/components/ui/client-only";

interface CampusStoryRingProps {
  /** Wrapped content — typically a campus avatar. */
  children: ReactNode;
  /**
   * Real per-campus "waiting" (new) patient count. Renders as one dashed
   * segment per patient, capped at MAX_VISIBLE_SEGMENTS so the ring always
   * reads as segmented (rather than the mockup's own literal ">14 = solid"
   * cutoff, which never triggers visible dashes given our real campus
   * counts run well above 14) — the exact count still shows in the badge.
   */
  unseenCount?: number;
  /** Diameter of the wrapped content in px (default 56). */
  size?: number;
}

const RADIUS = 45.5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RingStroke {
  stroke: string;
  strokeWidth: number;
  dasharray: string | undefined;
  linecap: "round" | "butt";
}

const MAX_VISIBLE_SEGMENTS = 10;

function ringStroke(count: number): RingStroke {
  if (!count) {
    return {
      stroke: "var(--border)",
      strokeWidth: 3.8,
      dasharray: undefined,
      linecap: "round",
    };
  }
  const segments = Math.min(count, MAX_VISIBLE_SEGMENTS);
  const gap = segments === 1 ? 8 : Math.max(3.4, Math.min(9, 46 / segments));
  const seg = CIRCUMFERENCE / segments - gap;
  return {
    stroke: "var(--gold-hi)",
    strokeWidth: 5.8,
    dasharray: `${seg.toFixed(2)} ${gap.toFixed(2)}`,
    linecap: seg > 7 ? "round" : "butt",
  };
}

export default function CampusStoryRing({
  children,
  unseenCount = 0,
  size = 56,
}: CampusStoryRingProps) {
  const { stroke, strokeWidth, dasharray, linecap } = ringStroke(unseenCount);

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <ClientOnly>
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full -rotate-90 overflow-visible"
          aria-hidden
        >
          <circle
            cx={50}
            cy={50}
            r={RADIUS}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap={linecap}
            strokeDasharray={dasharray}
            className="transition-[stroke-dasharray,stroke] duration-[450ms] ease-out"
          />
        </svg>
      </ClientOnly>
      <div className="relative m-[11%] h-[78%] w-[78%]">{children}</div>

      {unseenCount > 0 && (
        <span
          className="bg-destructive border-background absolute -top-0.5 -right-0.5 z-10 flex min-w-[17px] items-center justify-center rounded-full border-2 px-[3px] text-[9.4px] leading-[13px] font-extrabold text-white shadow-[0_4px_12px_rgba(0,0,0,.45)]"
          style={{ height: 17 }}
        >
          {unseenCount > 99 ? "99+" : unseenCount}
        </span>
      )}
    </div>
  );
}
