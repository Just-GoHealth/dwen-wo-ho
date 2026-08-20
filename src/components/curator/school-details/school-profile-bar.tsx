"use client";

import { Users } from "lucide-react";
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
 * Top utility row — brand mark, patient roll count + 911/Now/ASAP filter
 * chips, and a dashed-gold "Providers" pill, all in one row (matches the
 * reference screenshot's top strip). The school's own identity (crest,
 * nickname, next-fixture, access codes) lives in `SchoolGlassBar` at the
 * bottom instead — same split the provider home screen uses (utility row
 * up top, identity bar at the bottom).
 */
export function SchoolProfileBar({
  providerCount,
  rollCount,
  triageFilter,
  onTriageFilterChange,
  onOpenProviders,
}: SchoolProfileBarProps) {
  return (
    <div className="mb-6 flex items-center gap-4 py-4">
      <Logo variant="white" withLink={false} className="h-6 w-auto shrink-0" />

      <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
        <p className="text-foreground text-xl font-extrabold tracking-tight">
          {rollCount} <span className="text-foreground/90">Patients</span>
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
                  className="cursor-pointer px-3 py-1 text-xs font-bold tracking-[.08em]"
                >
                  {TRIAGE_TIER_LABELS[tier]}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenProviders}
        className="text-foreground inline-flex shrink-0 items-center gap-2 rounded-full border-[1.6px] border-dashed border-[rgba(232,212,173,.75)] bg-[rgba(232,212,173,.16)] px-4 py-2.5 text-sm font-extrabold shadow-[0_10px_26px_rgba(0,0,0,.2)] backdrop-blur-[8px] backdrop-saturate-[140%] transition-all hover:-translate-y-0.5 hover:border-[var(--gold-hi)] hover:bg-[rgba(232,212,173,.3)]"
      >
        <Users className="size-4" />
        {providerCount} Providers
      </button>
    </div>
  );
}
