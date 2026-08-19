"use client";

import Image from "next/image";
import { Users } from "lucide-react";
import { MdSchool } from "react-icons/md";
import type { School } from "@/lib/types/entities/school";

interface SchoolProfileBarProps {
  school: Pick<School, "name" | "nickname" | "logo" | "type">;
  providerCount: number;
  onEditClick: () => void;
  onOpenProviders: () => void;
}

/**
 * School identity bar — matches `.m-bar`/`.m-school`/`.m-crest`/`.m-name` and
 * the `.sc-pill.sc-prov` "Providers" glass pill in
 * guide/Bronze Fury A_33.html: name+type on the left, a crest + oversized
 * nickname centered over the whole bar, and a dashed-gold frosted pill on
 * the right. Crest/nickname stay clickable to reach the existing
 * edit-school flow. The mock also shows an "Access Codes" pill and an NSMQ
 * contest pill here — both back onto data that doesn't exist yet, so they're
 * omitted (see guide/curator-design-refactor-backend-needs.md).
 */
export function SchoolProfileBar({
  school,
  providerCount,
  onEditClick,
  onOpenProviders,
}: SchoolProfileBarProps) {
  return (
    <div className="relative mb-6 flex items-center gap-6 py-6">
      <div className="min-w-0 flex-1 shrink-0">
        <p className="text-primary truncate text-[13px] font-extrabold tracking-[.05em] uppercase">
          {school.name}
        </p>
        {school.type && (
          <p className="text-muted-foreground/70 mt-1 text-xs font-bold tracking-[.14em] uppercase">
            {school.type}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onEditClick}
        aria-label="Edit school logo and details"
        className="absolute top-1/2 left-1/2 flex max-w-[60vw] -translate-x-1/2 -translate-y-1/2 items-center gap-4"
      >
        <span className="relative flex size-[clamp(52px,8.4vh,86px)] shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-[var(--gold)] bg-[rgba(43,18,16,.5)] shadow-[0_10px_26px_rgba(0,0,0,.55)]">
          {school.logo ? (
            <Image
              src={school.logo}
              alt={school.name}
              fill
              className="object-cover"
            />
          ) : (
            <MdSchool className="text-muted-foreground/60 text-2xl" />
          )}
        </span>
        <span className="text-primary text-[clamp(32px,7.2vh,64px)] leading-[.95] font-extrabold tracking-[-1.5px] whitespace-nowrap">
          {school.nickname || school.name}
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenProviders}
        className="text-foreground ml-auto inline-flex shrink-0 items-center gap-2 rounded-full border-[1.6px] border-dashed border-[rgba(232,212,173,.75)] bg-[rgba(232,212,173,.16)] px-4 py-2.5 text-sm font-extrabold shadow-[0_10px_26px_rgba(0,0,0,.2)] backdrop-blur-[8px] backdrop-saturate-[140%] transition-all hover:-translate-y-0.5 hover:border-[var(--gold-hi)] hover:bg-[rgba(232,212,173,.3)]"
      >
        <Users className="size-4" />
        {providerCount} Providers
      </button>
    </div>
  );
}
