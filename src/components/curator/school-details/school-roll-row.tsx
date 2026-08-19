"use client";

import { Badge } from "@/components/ui/badge";
import {
  TRIAGE_TIER_LABELS,
  TRIAGE_CHIP_VARIANT,
  TRIAGE_CHIP_VARIANT_LIT,
  type TriageTier,
} from "@/lib/utils/shared/triage";

interface SchoolRollRowProps {
  rollCount: number;
  triageFilter: TriageTier | "all";
  onTriageFilterChange: (tier: TriageTier | "all") => void;
}

/**
 * The roll count + 911/Now/ASAP filter row centered under the school
 * identity bar — matches `.sc-head`/`.sc-count`/`.sc-tags` in
 * guide/Bronze Fury A_33.html. Reuses the same triage-tier badge variants
 * as the provider home screen's filter chips for one consistent look.
 */
export function SchoolRollRow({
  rollCount,
  triageFilter,
  onTriageFilterChange,
}: SchoolRollRowProps) {
  return (
    <div className="mb-6 flex flex-col items-center gap-2 text-center">
      <p className="text-foreground text-2xl font-extrabold tracking-tight">
        {rollCount}{" "}
        <span className="text-muted-foreground text-base font-bold">
          on this roll
        </span>
      </p>
      <div className="flex items-center gap-2">
        {(Object.keys(TRIAGE_TIER_LABELS) as TriageTier[]).map((tier) => {
          const isOn = triageFilter === tier;
          return (
            <button
              key={tier}
              type="button"
              onClick={() => onTriageFilterChange(isOn ? "all" : tier)}
              className="transition-transform hover:-translate-y-0.5"
            >
              <Badge
                variant={
                  isOn
                    ? TRIAGE_CHIP_VARIANT_LIT[tier]
                    : TRIAGE_CHIP_VARIANT[tier]
                }
                className="cursor-pointer px-4 py-1.5 text-sm font-bold tracking-[.1em]"
              >
                {TRIAGE_TIER_LABELS[tier]}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
