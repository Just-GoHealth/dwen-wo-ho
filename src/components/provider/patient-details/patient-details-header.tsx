"use client";

import { User, Activity, School, Calendar } from "lucide-react";
import { m } from "motion/react";
import { PatientResult } from "@/lib/types/entities/patient";
import { LockInAssessment } from "@/lib/types/entities/lockin";
import { getColorHex } from "@/lib/utils/shared/color-hex";
import { IconProgress } from "@tabler/icons-react";

interface PatientDetailsHeaderProps {
  patientResult: PatientResult;
  lockInAssessment: LockInAssessment | null;
  isTreating: boolean;
}

/**
 * Secondary metadata card (age/school/join-date/locked-in score) — real
 * product content with no mockup equivalent, so it lives below the domes
 * rather than in the floating top bar (see `PatientDetailTopBar`), which
 * matches the mockup's slim identity strip instead.
 */
export function PatientDetailsHeader({
  patientResult,
  lockInAssessment,
  isTreating,
}: PatientDetailsHeaderProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border-border relative overflow-hidden rounded-2xl border p-5 shadow-sm md:p-6"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-teal-500/5 to-transparent" />

      <div className="relative z-10 flex flex-col items-start gap-5 md:flex-row md:items-center">
        {/* Avatar / Initials */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 shadow-inner ring-1 ring-teal-500/20 md:h-20 md:w-20">
          <User className="h-8 w-8 opacity-80 md:h-10 md:w-10" />
        </div>

        {/* Patient Info */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-foreground text-2xl font-bold md:text-3xl">
              {patientResult?.patientName}
            </h1>
            {isTreating && (
              <span className="rounded-full border border-teal-200 bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                Treating
              </span>
            )}
            {patientResult?.visibilityStatus === "NEW" && (
              <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                New
              </span>
            )}
            {patientResult?.visibilityStatus === "SEEN" && (
              <span className="rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                Seen
              </span>
            )}
          </div>

          <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
            <div className="bg-muted/50 border-border/50 flex items-center gap-1.5 rounded-full border px-2.5 py-1">
              <Activity className="h-3.5 w-3.5 text-teal-600" />
              <span className="text-xs font-medium">
                {patientResult?.patientAge} yrs, {patientResult?.patientSex}
              </span>
            </div>

            <div className="bg-muted/50 border-border/50 flex items-center gap-1.5 rounded-full border px-2.5 py-1">
              <School className="h-3.5 w-3.5 text-teal-600" />
              <span className="text-xs font-medium">
                {patientResult?.schoolName}
              </span>
            </div>

            <div className="bg-muted/50 border-border/50 flex items-center gap-1.5 rounded-full border px-2.5 py-1">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              <span className="text-xs font-medium">
                Joined{" "}
                {new Date(patientResult?.createdAt || "").toLocaleDateString()}
              </span>
            </div>

            {lockInAssessment?.schoolType && (
              <div className="bg-muted/50 border-border/50 flex items-center gap-1.5 rounded-full border px-2.5 py-1">
                <School className="h-3.5 w-3.5 text-teal-600" />
                <span className="text-xs font-medium">
                  {lockInAssessment.schoolType}
                </span>
              </div>
            )}

            <div className="bg-muted/50 border-border/50 flex items-center gap-1.5 rounded-full border px-2.5 py-1">
              <IconProgress className="h-3.5 w-3.5 text-teal-600" />
              <span className="text-xs font-medium">
                Year: {patientResult?.patientLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Locked-In Score Indicator */}
        {lockInAssessment && (
          <div className="bg-muted/30 border-border/50 mx-auto flex min-w-32 flex-col items-center rounded-2xl border p-4 backdrop-blur-sm sm:mx-0">
            <span className="text-muted-foreground mb-1.5 text-[10px] font-bold tracking-wider uppercase">
              Locked In Score
            </span>

            <div className="mb-1.5 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-teal-600">
                {lockInAssessment?.lockedInScore.split("/")[0]}
              </span>
              <span className="text-muted-foreground text-base font-medium">
                /10
              </span>
            </div>

            <div
              className="rounded-full px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase shadow-sm"
              style={{
                backgroundColor: getColorHex(
                  lockInAssessment?.lockedInColor || "gray",
                ),
              }}
            >
              {lockInAssessment?.lockedInScoreDescription || "Unknown"}
            </div>
          </div>
        )}
      </div>
    </m.div>
  );
}
