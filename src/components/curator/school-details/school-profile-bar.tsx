"use client";

import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import {
  TRIAGE_TIER_LABELS,
  TRIAGE_CHIP_VARIANT,
  TRIAGE_CHIP_VARIANT_LIT,
  type TriageTier,
} from "@/lib/utils/shared/triage";

interface SchoolProfileBarProps {
  providerCount: number;
  rollCount: number;
  triageFilter: TriageTier | "all";
  onTriageFilterChange: (tier: TriageTier | "all") => void;
  onOpenProviders: () => void;
}

/**
 * Top utility row — brand mark + 911/Now/ASAP filter chips, both vertically
 * centered in one row. The school's own identity (crest, nickname,
 * next-fixture, access codes) lives in `SchoolGlassBar` at the bottom
 * instead — same split the provider home screen uses (utility row up top,
 * identity bar at the bottom).
 */
export function SchoolProfileBar({
  triageFilter,
  onTriageFilterChange,
}: SchoolProfileBarProps) {
  return (
    <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-4">
      <Logo
        variant="white"
        withLink={false}
        className="h-6 w-auto shrink-0 justify-self-start"
      />

      <div className="flex items-center gap-2 justify-self-center">
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
                  isOn ? TRIAGE_CHIP_VARIANT_LIT[tier] : TRIAGE_CHIP_VARIANT[tier]
                }
                className="cursor-pointer px-3 py-1 text-xs font-bold tracking-[.08em]"
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
