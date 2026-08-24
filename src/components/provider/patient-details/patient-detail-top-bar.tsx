"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, History, Heart } from "lucide-react";
import { PatientResult } from "@/lib/types/entities/patient";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PatientDetailTopBarProps {
  patientResult: PatientResult;
  onBack: () => void;
  onHistory: () => void;
  onGiveCare: () => void;
}

/**
 * Floating top bar for the patient detail screen — matches `.pd-top` in
 * guide/Bronze Fury A_33.html: back + History pills on the left, the
 * patient's identity absolutely centered, "Give Care" pill on the right.
 * No card container — sits directly on the page's gradient background.
 */
export function PatientDetailTopBar({
  patientResult,
  onBack,
  onHistory,
  onGiveCare,
}: PatientDetailTopBarProps) {
  const initials = (patientResult?.patientName || "?").charAt(0).toUpperCase();
  const [photoFailed, setPhotoFailed] = useState(false);

  const giveCareButton = (
    <button
      type="button"
      onClick={onGiveCare}
      className="animate-care-beat inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-[var(--gold-deep)] bg-white px-4 py-2 text-xs font-extrabold text-[var(--gold-lo)] shadow-[0_12px_30px_rgba(0,0,0,.36)] transition-transform hover:scale-105 sm:px-5 sm:py-2 sm:text-sm"
    >
      Give Care{" "}
      <Heart
        className="size-3.5 sm:size-4"
        fill="var(--gold-lo)"
        stroke="var(--gold-deep)"
        strokeWidth={1.5}
      />
    </button>
  );

  return (
    <div className="relative flex shrink-0 flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:gap-3 sm:px-6 sm:py-5 md:px-10">
      <div className="flex w-full items-center justify-between gap-2 sm:contents">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            title="Back to the roll"
            aria-label="Back"
            className="border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/10 inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-all hover:-translate-y-0.5"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={onHistory}
            className="border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/10 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-extrabold tracking-[.1em] uppercase transition-all hover:-translate-y-0.5"
          >
            <History className="size-3.5" />
            History
          </button>
        </div>
        <div className="sm:hidden">{giveCareButton}</div>
      </div>

      <div className="flex min-w-0 items-center justify-center gap-3 sm:absolute sm:top-1/2 sm:left-1/2 sm:order-2 sm:max-w-[60vw] sm:-translate-x-1/2 sm:-translate-y-1/2">
        <Avatar className="border-primary size-12 shrink-0 border-2 shadow-[0_10px_26px_rgba(0,0,0,.5)]">
          {patientResult.profilePhotoURL && !photoFailed ? (
            <Image
              src={patientResult.profilePhotoURL}
              alt={patientResult.patientName}
              fill
              sizes="48px"
              className="object-cover"
              onError={() => setPhotoFailed(true)}
            />
          ) : (
            <AvatarFallback className="bg-primary/15 text-primary text-lg font-bold">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex min-w-0 flex-col items-start gap-0.5">
          <span className="text-primary truncate text-xl font-extrabold tracking-[-.6px]">
            {patientResult.patientName}
          </span>
          <span className="text-muted-foreground truncate text-[11px] font-extrabold tracking-[.1em] uppercase">
            {patientResult.schoolName}
          </span>
        </div>
      </div>

      <div className="hidden sm:order-3 sm:ml-auto sm:block">
        {giveCareButton}
      </div>
    </div>
  );
}
