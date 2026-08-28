"use client";

import { KeyRound } from "lucide-react";
import { MdSchool } from "react-icons/md";
import type { ReactNode } from "react";
import { ProviderGlassBar } from "@/components/provider/workspace/provider-glass-bar";
import type { School } from "@/lib/types/entities/school";

interface SchoolGlassBarProps {
  school: Pick<School, "name" | "nickname" | "logo" | "type">;
  onEditClick: () => void;
  onOpenAccessCodes: () => void;
  /** Compact "next fixture" pill, rendered next to the nickname — omitted
   * entirely when this school has no team in the current competition. */
  fixturePill?: ReactNode;
}

/**
 * Bottom identity/action bar for the school-detail screen — matches `.m-bar`
 * in guide/Bronze Fury A_33.html: school name+type on the left, crest +
 * oversized nickname (+ next-fixture pill) centered, "Access Codes" pill on
 * the right. Reuses `ProviderGlassBar` as-is — it's a pure layout shell with
 * no provider-specific logic, so there's no need for a second copy of the
 * same glass-bar CSS.
 */
export function SchoolGlassBar({
  school,
  onEditClick,
  onOpenAccessCodes,
  fixturePill,
}: SchoolGlassBarProps) {
  return (
    <ProviderGlassBar
      className="sticky bottom-0 z-50"
      left={
        <div className="min-w-0">
          <p className="text-primary truncate text-[13px] font-extrabold tracking-[.05em] uppercase">
            {school.name}
          </p>
          {school.type && (
            <p className="text-muted-foreground/70 mt-1 text-xs font-bold tracking-[.14em] uppercase">
              {school.type}
            </p>
          )}
        </div>
      }
      center={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEditClick}
            aria-label="Edit school logo and details"
            className="flex min-w-0 items-center gap-3"
          >
            <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--gold)] bg-[rgba(43,18,16,.5)] shadow-[0_10px_26px_rgba(0,0,0,.55)] sm:size-14">
              {school.logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization
                <img
                  src={school.logo}
                  alt={school.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <MdSchool className="text-muted-foreground/60 text-2xl" />
              )}
            </span>
            <span className="text-primary truncate text-2xl leading-[.95] font-extrabold tracking-[-1px] sm:text-4xl">
              {school.nickname || school.name}
            </span>
          </button>
          {fixturePill}
        </div>
      }
      right={
        <button
          type="button"
          onClick={onOpenAccessCodes}
          className="text-foreground inline-flex shrink-0 items-center gap-2 rounded-full border-[1.6px] border-dashed border-[rgba(232,212,173,.75)] bg-[rgba(232,212,173,.16)] px-4 py-2.5 text-sm font-extrabold shadow-[0_10px_26px_rgba(0,0,0,.2)] backdrop-blur-[8px] backdrop-saturate-[140%] transition-all hover:-translate-y-0.5 hover:border-[var(--gold-hi)] hover:bg-[rgba(232,212,173,.3)]"
        >
          <KeyRound className="size-4" />
          Access Codes
        </button>
      }
    />
  );
}
