"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import CampusStoryRing from "@/components/shared/campus-story-ring";
import type { ProviderDashboardState } from "@/hooks/provider/dashboard/use-dashboard";
import { cn } from "@/lib/utils";

interface CampusRingRowProps {
  activeSchool: ProviderDashboardState["activeSchool"];
  handleSelectSchool: ProviderDashboardState["handleSelectSchool"];
  handleClearSchool: ProviderDashboardState["handleClearSchool"];
  schools: ProviderDashboardState["schools"];
  newCountBySchool: ProviderDashboardState["newCountBySchool"];
  isLoading?: boolean;
}

const RING_SIZE = 48;

/** Dimmed + desaturated siblings while one campus is active — matches
 * `.pr-schools.filtered .pr-sch:not(.on){opacity:.32;filter:grayscale(.55)}`. */
const DIMMED_SIBLING = "opacity-40 grayscale-[.55]";

/** Hover lift + border transition shared by every campus icon — matches
 * `.pr-sch{transition:transform .22s cubic-bezier(.2,.8,.3,1.4)}` and
 * `.pr-sch:hover{transform:translateY(-5px)}` in the mockup. */
const HOVER_LIFT =
  "transition-transform duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.3,1.4)] hover:-translate-y-[5px]";

function shortLabel(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase() || "?"
  );
}

/**
 * Top campus-switcher row — one avatar per school the provider is assigned
 * to, each wearing a segmented story-ring sized to that campus's real
 * "waiting" (new) patient count (`newCountBySchool`, derived from the
 * dashboard's patient list) — one segment per patient, exactly matching
 * `prRing()` in guide/Bronze Fury A_33.html. Clicking pins the patient grid
 * to that campus and dims every other campus (`.pr-schools.filtered
 * .pr-sch:not(.on)`); clicking the already-active campus again clears the
 * filter — there's no separate "All" icon in the mockup, since unclicking
 * the active one already returns you to the full roll.
 */
export function CampusRingRow({
  activeSchool,
  handleSelectSchool,
  handleClearSchool,
  schools,
  newCountBySchool,
  isLoading,
}: CampusRingRowProps) {
  const isFiltered = activeSchool !== "all";
  const scrollRef = useRef<HTMLDivElement>(null);
  // Only show a caret on the side there's actually more to scroll toward —
  // no point offering a left/right nudge when the whole row already fits.
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, schools.length]);

  const scrollByAmount = (direction: 1 | -1) => {
    scrollRef.current?.scrollBy({
      left: direction * (RING_SIZE + 96),
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="no-scrollbar flex items-center justify-center gap-3 overflow-x-auto px-6 py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`campus-ring-skeleton-${i}`}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <Skeleton
              className="rounded-full"
              style={{ width: RING_SIZE, height: RING_SIZE }}
            />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          aria-label="Scroll campuses left"
          className="border-border text-muted-foreground hover:border-primary hover:text-primary bg-background/80 absolute top-1/2 left-1 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}

      {/* Centered when everything fits (nicer default look), left-aligned
        the moment it overflows — centering an overflowing scroll container
        leaves whatever spills past the left edge permanently unreachable
        (scrollLeft can't go negative), which cut off the first campus
        entirely when there were enough schools to need scrolling. */}
      <div
        ref={scrollRef}
        className={cn(
          "no-scrollbar flex items-center gap-3 overflow-x-auto px-12 py-4",
          canScrollLeft || canScrollRight ? "justify-start" : "justify-center",
        )}
      >
        {schools
          .filter((s) => s.schoolId != null)
          .map((school) => {
            const id = String(school.schoolId);
            const isActive = activeSchool === id;
            const waiting = newCountBySchool[id] ?? 0;
            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  isActive ? handleClearSchool() : handleSelectSchool(id)
                }
                title={`${school.schoolName} — ${waiting} waiting`}
                className={cn(
                  "group flex shrink-0 flex-col items-center gap-1.5",
                  HOVER_LIFT,
                  isFiltered && !isActive && DIMMED_SIBLING,
                )}
              >
                <CampusStoryRing unseenCount={waiting} size={RING_SIZE}>
                  <Avatar
                    className={cn(
                      "size-full border-2 bg-white",
                      isActive
                        ? "border-[var(--gold-hi)] shadow-[0_0_0_3px_rgba(232,212,173,.28)]"
                        : "border-border group-hover:border-[var(--gold-hi)]",
                    )}
                  >
                    <AvatarImage src={school.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-primary bg-transparent text-xs font-bold">
                      {shortLabel(school.schoolName ?? "")}
                    </AvatarFallback>
                  </Avatar>
                </CampusStoryRing>
                <span
                  className={cn(
                    "max-w-16 truncate text-xs font-semibold",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {school.schoolName}
                </span>
              </button>
            );
          })}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          aria-label="Scroll campuses right"
          className="border-border text-muted-foreground hover:border-primary hover:text-primary bg-background/80 absolute top-1/2 right-1 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-colors sm:right-14"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  );
}
