"use client";

import {
  ChevronLeft,
  User,
  Activity,
  School,
  Calendar,
  CheckCheck,
  EyeOff,
  Eye,
} from "lucide-react";
import { IconProgress } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { colourHex } from "@/lib/utils/curator/patient-dashboard/outcome-metrics";
import type { PatientHeaderProps } from "@/lib/types/components/curator/patient-dashboard";

const SOURCE_LABELS = {
  QUICK_SCREEN: "Quick Screen",
  TRIAGE_RUN: "NSMQ",
} as const;

export default function PatientHeader({
  detail,
  onBack,
  onToggleActive,
  isTogglingActive,
  onAccept,
  isAccepting,
}: PatientHeaderProps) {
  const { result } = detail;
  const lockedIn = result.lockedIn;

  return (
    <div className="bg-card border-border relative mb-8 overflow-hidden rounded-3xl border p-4 shadow-sm sm:p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground gap-2 rounded-full pl-0 transition-colors hover:bg-transparent"
        >
          <ChevronLeft className="size-5" /> Back to List
        </Button>
      </div>

      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-8">
        <div className="flex w-full flex-col items-center justify-center space-y-2 md:w-auto">
          <Avatar className="size-24 shrink-0 rounded-3xl bg-teal-500/10 text-teal-600 shadow-inner ring-1 ring-teal-500/20 md:size-32">
            <AvatarFallback className="rounded-3xl bg-transparent text-teal-600">
              {result.initials ? (
                <span className="text-3xl font-bold md:text-4xl">
                  {result.initials}
                </span>
              ) : (
                <User className="h-12 w-12 opacity-80 md:h-16 md:w-16" />
              )}
            </AvatarFallback>
          </Avatar>
          <LoadingButton
            variant="outline"
            onClick={onToggleActive}
            loading={isTogglingActive}
            className="w-full gap-2 rounded-md"
          >
            <span className="flex items-center gap-2">
              {result.active ? (
                <>
                  <EyeOff className="size-4" /> Mark inactive
                </>
              ) : (
                <>
                  <Eye className="size-4" /> Mark active
                </>
              )}
            </span>
          </LoadingButton>
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-foreground mb-3 text-3xl font-bold break-words md:text-4xl">
            {result.displayName}
          </h1>

          <div className="text-muted-foreground mb-4 flex flex-wrap gap-2 text-sm sm:gap-3">
            {(result.age != null || result.gender) && (
              <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
                <Activity className="h-4 w-4 text-teal-600" />
                <span className="font-medium">
                  {[
                    result.age != null ? `${result.age} yrs` : null,
                    result.gender?.toLowerCase(),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}

            {detail.campusName && (
              <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
                <School className="h-4 w-4 text-teal-600" />
                <span className="font-medium">{detail.campusName}</span>
              </div>
            )}

            <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <Calendar className="h-4 w-4 text-teal-600" />
              <span className="font-medium">
                {SOURCE_LABELS[detail.source]}{" "}
                {new Date(result.createdAt).toLocaleDateString()}
              </span>
            </div>

            {result.yearLabel && (
              <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
                <IconProgress className="h-4 w-4 text-teal-600" />
                <span className="font-medium">{result.yearLabel}</span>
              </div>
            )}
          </div>

          {result.awaitingAcceptance && (
            <div className="border-warning/50 bg-warning/10 flex flex-col gap-2 rounded-xl border px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-foreground text-sm font-medium">
                Awaiting your acceptance. Providers see it once accepted.
              </p>
              <LoadingButton
                size="sm"
                loading={isAccepting}
                onClick={onAccept}
                className="shrink-0"
              >
                <span className="flex items-center gap-2">
                  Accept <CheckCheck className="size-4" />
                </span>
              </LoadingButton>
            </div>
          )}
        </div>

        {lockedIn && (
          <div className="bg-muted/30 border-border/50 mx-auto flex min-w-40 flex-col items-center rounded-3xl border p-6 backdrop-blur-sm sm:mx-0">
            <span className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
              Locked In Score
            </span>

            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight text-teal-600">
                {lockedIn.score}
              </span>
              <span className="text-muted-foreground text-lg font-medium">
                /10
              </span>
            </div>

            <div
              className="h-2 w-16 rounded-full"
              style={{ backgroundColor: colourHex(lockedIn.colour) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
