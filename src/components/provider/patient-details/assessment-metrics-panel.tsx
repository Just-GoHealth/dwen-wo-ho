"use client";

import { useState } from "react";
import { Brain, AlertCircle, BookOpen } from "lucide-react";
import { MetricCategory } from "@/hooks/provider/patient-details/use-patient-details";
import { AssessmentDomeTile } from "./assessment-dome-tile";

interface AssessmentMetricsPanelProps {
  metrics: MetricCategory[];
}

const categoryIcons = [Brain, AlertCircle, BookOpen];

/**
 * Static UI copy for each dome's caption/kicker row — not per-patient data,
 * just fixed labels tied to the (fixed) category order returned by
 * `useProviderPatientDetails()`: General Mental Health, Exam Anxiety, Exam
 * Prep. Mirrors the mockup's caption+kicker row without fabricating a
 * per-patient time reference we don't have.
 */
const DOME_CAPTIONS = [
  { time: "Over the last two weeks", kicker: "Mental Health" },
  { time: "Heading into exams", kicker: "Anxiety Screening" },
  { time: "Right now", kicker: "Exam Readiness" },
];

/**
 * Grid `order` per item, keyed by which index is open — always puts the
 * open dome in the middle column (order value 1), with the other two
 * keeping their original left-right relative order on either side.
 * Explicit per-case rather than a formula: with exactly 3 domes, a
 * generic "before/after openIndex" formula gets the edge cases wrong
 * (e.g. opening index 0 has nothing "before" it, so a formula assigning
 * order by relative position ends up placing it first, not centered).
 */
const DOME_ORDER: Record<number, [number, number, number]> = {
  0: [1, 0, 2],
  1: [0, 1, 2],
  2: [0, 2, 1],
};

/**
 * The row of assessment "domes" — matches `.rb-row`/`#pdBoard` in
 * guide/Bronze Fury A_33.html. Opening one dome hides the others (state
 * lifted here since only one can be open at a time), matching
 * `.rb-row:has(.dome-slot.open) .dome-slot:not(.open){opacity:0}`.
 */
export function AssessmentMetricsPanel({
  metrics,
}: AssessmentMetricsPanelProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (metrics.length === 0) return null;

  return (
    <div
      className="flex min-h-full w-full flex-col items-center justify-center gap-6 py-6"
      onClick={(e) => {
        // "Tap anywhere else to close" — matches the mockup's board-level
        // click guard (`if(!event.target.closest('.dome-slot')) pdCloseAll()`).
        if (!(e.target as HTMLElement).closest("[data-dome-slot]")) {
          setOpenIndex(null);
        }
      }}
    >
      <p className="text-muted-foreground/70 text-xs">
        Tap a dome to see every answer behind it.
      </p>
      <div className="grid w-full max-w-[1600px] grid-cols-1 items-start gap-6 px-4 sm:grid-cols-3 sm:gap-8 sm:px-10">
        {metrics.map((category, idx) => {
          const isOpen = openIndex === idx;
          const order = openIndex === null ? idx : DOME_ORDER[openIndex][idx];
          return (
            <AssessmentDomeTile
              key={category.name}
              category={category}
              icon={categoryIcons[idx] || Brain}
              timeCaption={DOME_CAPTIONS[idx]?.time ?? ""}
              kicker={DOME_CAPTIONS[idx]?.kicker ?? ""}
              open={isOpen}
              hidden={openIndex !== null && !isOpen}
              order={order}
              staggerIndex={idx}
              onToggle={() =>
                setOpenIndex((prev) => (prev === idx ? null : idx))
              }
            />
          );
        })}
      </div>
    </div>
  );
}
