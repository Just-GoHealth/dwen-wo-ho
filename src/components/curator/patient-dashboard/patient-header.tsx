"use client";

import { useState } from "react";
import {
  ChevronLeft,
  User,
  Activity,
  School,
  Calendar,
  Trash2,
} from "lucide-react";
import { IconProgress } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getColorHex } from "@/lib/utils/shared/color-hex";
import type { PatientHeaderProps } from "@/lib/types/components/curator/patient-dashboard";

export default function PatientHeader({
  patientResult,
  lockInAssessment,
  onBack,
  onDelete,
}: PatientHeaderProps) {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <div className="bg-card border-border relative mb-8 overflow-hidden rounded-3xl border p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground gap-2 rounded-full pl-0 transition-colors hover:bg-transparent"
        >
          <ChevronLeft className="size-5" /> Back to List
        </Button>
      </div>

      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Avatar className="size-24 shrink-0 rounded-3xl bg-teal-500/10 text-teal-600 shadow-inner ring-1 ring-teal-500/20 md:size-32">
            {patientResult.profilePhotoURL && !photoFailed ? (
              // eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization
              <img
                src={patientResult.profilePhotoURL}
                alt={patientResult.patientName}
                className="absolute inset-0 size-full object-cover"
                onError={() => setPhotoFailed(true)}
              />
            ) : (
              <AvatarFallback className="rounded-3xl bg-transparent text-teal-600">
                <User className="h-12 w-12 opacity-80 md:h-16 md:w-16" />
              </AvatarFallback>
            )}
          </Avatar>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="w-full gap-2 rounded-md"
          >
            <Trash2 className="size-4" /> Delete
          </Button>
        </div>

        <div className="flex-1">
          <h1 className="text-foreground mb-3 text-3xl font-bold md:text-4xl">
            {patientResult.patientName}
          </h1>

          <div className="text-muted-foreground mb-4 flex flex-wrap gap-3 text-sm">
            <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <Activity className="h-4 w-4 text-teal-600" />
              <span className="font-medium">
                {patientResult.patientAge} yrs, {patientResult.patientSex}
              </span>
            </div>

            <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <School className="h-4 w-4 text-teal-600" />
              <span className="font-medium">{patientResult.schoolName}</span>
            </div>

            <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <Calendar className="h-4 w-4 text-teal-600" />
              <span className="font-medium">
                Joined{" "}
                {new Date(patientResult.createdAt || "").toLocaleDateString()}
              </span>
            </div>

            {lockInAssessment.schoolType && (
              <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
                <School className="h-4 w-4 text-teal-600" />
                <span className="font-medium">
                  {lockInAssessment.schoolType}
                </span>
              </div>
            )}

            <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <IconProgress className="h-4 w-4 text-teal-600" />
              <span className="font-medium">
                Year: {patientResult.patientLevel}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 border-border/50 mx-auto flex min-w-40 flex-col items-center rounded-3xl border p-6 backdrop-blur-sm sm:mx-0">
          <span className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
            Locked In Score
          </span>

          <div className="mb-2 flex items-baseline gap-1">
            <span className="text-5xl font-bold tracking-tight text-teal-600">
              {lockInAssessment.lockedInScore.split("/")[0]}
            </span>
            <span className="text-muted-foreground text-lg font-medium">
              /10
            </span>
          </div>

          <div
            className="rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-white uppercase shadow-sm"
            style={{
              backgroundColor: getColorHex(
                lockInAssessment.lockedInColor || "gray",
              ),
            }}
          >
            {lockInAssessment.lockedInScoreDescription || "Unknown"}
          </div>
        </div>
      </div>
    </div>
  );
}
