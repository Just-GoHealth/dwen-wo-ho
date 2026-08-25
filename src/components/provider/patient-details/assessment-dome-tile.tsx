"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetricCategory } from "@/hooks/provider/patient-details/use-patient-details";

interface AssessmentDomeTileProps {
  category: MetricCategory;
  icon: LucideIcon;
  /** Static UI copy (not per-patient data) — see DOME_CAPTIONS in
   * assessment-metrics-panel.tsx. */
  timeCaption: string;
  kicker: string;
  open: boolean;
  hidden: boolean;
  /** Grid `order` — the open dome always sits in the middle column. */
  order: number;
  /** Fixed category position (0/1/2), independent of `order` — drives the
   * vertical stagger below. */
  staggerIndex: number;
  onToggle: () => void;
}

/** Matches `.rb-row .dome-slot{--stag}` in the mockup: the outer two domes
 * sit higher, the middle one sits lower, for a zigzag row instead of a flat
 * line. Resets to 0 while open, same as `.dome-slot.open{--stag:0px}`. */
const STAGGER_Y: Record<number, string> = {
  0: "calc(-1 * clamp(16px, 2.6vh, 32px))",
  1: "clamp(20px, 3.4vh, 42px)",
  2: "calc(-1 * clamp(16px, 2.6vh, 32px))",
};

/**
 * A single assessment "dome" — matches `.dome`/`.dome-slot`/`.tile-unit` in
 * guide/Bronze Fury A_33.html: a half-circle glass tile (`rounded-t-full` on
 * a 2:1 box gives the exact dome shape), a white dotted score plate, and a
 * severity band pill. Tapping expands it in place to show itemized answers
 * (`.ss` rows) below the arch; the parent panel hides sibling domes while
 * one is open.
 *
 * Reuses the existing `MetricCategory` shape unchanged. The band pill uses
 * the category's own severity color (`generalMentalHealthColor` etc. from
 * the backend) — it used to borrow the first item's color instead, which
 * could show a band color that had nothing to do with the category's own
 * description (e.g. a "Poor" band rendering green because the first item
 * happened to be green).
 */
export function AssessmentDomeTile({
  category,
  icon: Icon,
  timeCaption,
  kicker,
  open,
  hidden,
  order,
  staggerIndex,
  onToggle,
}: AssessmentDomeTileProps) {
  const bandColor = category.color || "var(--muted-foreground)";
  const slotRef = useRef<HTMLDivElement>(null);

  // Opening a dome can reorder/hide siblings above it (the open one always
  // moves to the middle grid slot), so the tapped tile can end up out of
  // view with no layout cue that it moved — bring it back into the center
  // of the viewport instead of leaving the provider to hunt for it.
  useEffect(() => {
    if (open) {
      slotRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [open]);

  return (
    <div
      ref={slotRef}
      data-dome-slot
      style={
        {
          order,
          "--dome-stagger": open ? "0px" : (STAGGER_Y[staggerIndex] ?? "0px"),
        } as CSSProperties
      }
      className={cn(
        "flex w-full max-w-[420px] flex-col items-stretch justify-self-center transition-[opacity,transform] duration-300 ease-out",
        // Stagger is a 3-across zigzag — only makes sense once the grid is
        // actually 3 columns wide (sm: and up). Stacked single-column on
        // mobile stays flat.
        "sm:[transform:translateY(var(--dome-stagger))]",
        hidden && "pointer-events-none opacity-0",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "relative flex aspect-[2/1] w-full origin-bottom flex-col items-center justify-end",
          "rounded-t-full border border-white/[.16] bg-white/[.055] px-6 pb-4 text-center",
          "shadow-[0_14px_32px_rgba(0,0,0,.45)] backdrop-blur-[14px]",
          "transition-all duration-300 ease-out hover:-translate-y-3 hover:scale-[1.07]",
          "hover:border-white/30 hover:bg-white/[.09] hover:shadow-[0_28px_56px_rgba(0,0,0,.55),0_0_40px_rgba(232,212,173,.18)]",
          open && "scale-110",
        )}
      >
        <span className="text-muted-foreground text-xs font-extrabold tracking-wide">
          {timeCaption}
        </span>
        <span className="text-foreground mt-1 max-w-[75%] text-base leading-tight font-bold tracking-tight sm:max-w-none sm:text-xl">
          {category.name}
        </span>
        <span className="text-muted-foreground/80 mt-1 flex items-center gap-1 text-[11px] font-extrabold tracking-wide uppercase">
          <Icon className="size-3.5" />
          {kicker}
        </span>
        <span className="mt-1.5 w-fit self-center rounded-lg bg-white/95 px-3.5 py-1 text-base font-extrabold text-[#2b1210] shadow-md">
          {category.score}
        </span>
        <span
          className="mt-2 rounded-full px-3.5 py-1 text-xs font-extrabold tracking-wide uppercase shadow"
          style={{ backgroundColor: bandColor, color: "#fff" }}
        >
          {category.description}
        </span>
      </button>

      {open && (
        // mb matches the page's own reserved space for the fixed
        // ProviderGlassBar (see patients/[resultId]/page.tsx's outer
        // scroll container) - without it, this list's own scroll area
        // doesn't know the bar exists and its last rows render underneath
        // it instead of stopping short.
        <div className="mt-3 mb-[clamp(112px,20vh,188px)] flex max-h-[40vh] flex-col gap-2 overflow-y-auto">
          {category.items.map((item, i) => (
            <div
              key={item.name}
              style={{ animationDelay: `${i * 0.06}s` }}
              className="animate-in fade-in slide-in-from-top-3 fill-mode-backwards flex items-center gap-2.5 rounded-[10px] border border-black/10 bg-[#f2e7d4] px-3 py-2 shadow-[0_6px_16px_rgba(0,0,0,.3)] duration-300 ease-out"
            >
              <span
                className="size-5 shrink-0 rounded-[4px] border-2"
                style={{
                  borderColor: item.color,
                  backgroundColor: item.color,
                }}
              />
              <span className="min-w-0 flex-1 text-xs font-extrabold tracking-wide text-[#2c1622] uppercase">
                {item.name}
              </span>
              <span
                className="shrink-0 text-[11px] font-extrabold tracking-wide uppercase"
                style={{ color: item.color }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
