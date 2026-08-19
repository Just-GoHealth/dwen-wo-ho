"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronRight, Loader2, User } from "lucide-react";
import { compactTimeAgo } from "@/lib/utils/shared/time-ago";
import {
  deriveTriageTier,
  TRIAGE_TIER_LABELS,
} from "@/lib/utils/shared/triage";
import type { TriageTier } from "@/lib/utils/shared/triage";
import { deriveTeamCount } from "@/lib/utils/shared/team-stack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type {
  PatientCardPatient,
  PatientCardProps,
} from "@/lib/types/components/shared/patient-card";
import { resolvePatientCardFields } from "./patient-card-accessors";

const TRIAGE_BADGE_VARIANT = {
  "911": "triage-911",
  now: "triage-now",
  asap: "triage-asap",
} as const;
const TRIAGE_BADGE_VARIANT_LIT = {
  "911": "triage-911-lit",
  now: "triage-now-lit",
  asap: "triage-asap-lit",
} as const;

interface PatientGridCardOwnProps {
  /** Which triage tier is currently toggled in the bottom bar, if any —
   * matches the mockup's "lit" state (solid fill) vs. the resting light
   * pill every card shows otherwise. */
  activeTriageFilter?: TriageTier | "all";
  /** Bulk-select checkbox — a real product need (curator's bulk-delete
   * flow) with no mockup equivalent, so it's an overlay in the corner
   * rather than part of the `.pt-card` layout itself. */
  showCheckbox?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string | number, checked: boolean) => void;
  /** The signed-in provider's own avatar — renders as the square gold-ringed
   * "me" tile in the team stack (`.pt-team i.me`). Only provided on the
   * provider's own dashboard; omitted entirely on curator screens, since
   * curators aren't "treating" a case the way this stack implies. */
  currentProviderAvatarUrl?: string;
  currentProviderInitial?: string;
}

/**
 * Overlapping "who's on this case" avatars — matches `.pt-team`/`.pt-team
 * i`/`.pt-team i.me` in guide/Bronze Fury A_33.html: circles for other
 * providers, a square gold-ringed tile for "me" (the signed-in provider) to
 * differentiate at a glance. There is no backend endpoint yet for "which
 * providers have opened this case" (see
 * guide/provider-design-refactor-backend-needs.md) — the circle avatars
 * here are placeholder stand-ins (generic icon, not a fabricated photo or
 * name). Only rendered by the caller when `deriveTeamCount() > 0`; when
 * there's no team data the NEW badge takes this slot instead.
 */
function TeamAvatarStack({
  otherCount,
  currentProviderAvatarUrl,
  currentProviderInitial,
}: {
  otherCount: number;
  currentProviderAvatarUrl?: string;
  currentProviderInitial?: string;
}) {
  const shown = Math.min(otherCount, 2);
  const overflow = otherCount - shown;

  return (
    <div className="flex items-center">
      <span
        title="You"
        className="relative z-[2] -mr-[6px] flex size-[29px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] border-[1.65px] border-[var(--gold)] bg-[rgba(43,18,16,.6)] text-[9.6px] font-extrabold text-white shadow-[0_0_0_1.6px_rgba(232,212,173,.55),0_4px_12px_rgba(0,0,0,.45)]"
      >
        {currentProviderAvatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- tiny fixed-size avatar tile, not a content image
          <img
            src={currentProviderAvatarUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          currentProviderInitial
        )}
      </span>
      {Array.from({ length: shown }).map((_, i) => (
        <span
          key={i}
          title="Another provider on this case"
          className="-mr-[9px] flex size-[27px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.65px] border-[rgba(43,18,16,.92)] bg-[rgba(43,18,16,.6)] text-white/70"
        >
          <User className="size-3.5" strokeWidth={2.2} />
        </span>
      ))}
      {overflow > 0 && (
        <span className="flex size-[27px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.65px] border-[rgba(43,18,16,.92)] bg-white/[.18] text-[9.6px] font-extrabold text-white">
          +{overflow}
        </span>
      )}
    </div>
  );
}

/**
 * Grid-tile patient card for the provider home screen (campus roster grid).
 * Matches `.pt-card`/`.pt-hd`/`.pt-pic`/`.pt-nm`/`.pt-sub`/`.pt-open` in
 * guide/Bronze Fury A_33.html exactly. Structurally distinct from
 * `PatientCard` (a list row) but shares the same accessor layer so both can
 * render either `PatientCase` or `SchoolPatientRecord` data.
 */
export default function PatientGridCard<T extends PatientCardPatient>({
  patient,
  index = 0,
  onActionClick,
  detailRoute,
  getId,
  getScore,
  getStatus,
  getTime,
  getPatientName,
  getSchoolNickname,
  getSchoolName,
  getAvatarUrl,
  activeTriageFilter = "all",
  showCheckbox = false,
  selected = false,
  onToggleSelect,
  currentProviderAvatarUrl,
  currentProviderInitial,
}: PatientCardProps<T> & PatientGridCardOwnProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const fields = resolvePatientCardFields(patient, {
    getId,
    getScore,
    getStatus,
    getTime,
    getPatientName,
    getSchoolNickname,
    getSchoolName,
    getAvatarUrl,
  });

  const tier = deriveTriageTier(fields.score ?? null, fields.status || "new");
  const isLit = activeTriageFilter === tier;
  const isNew = (fields.status || "").toLowerCase() === "new";
  const initials = (fields.patientName || "?").charAt(0).toUpperCase();
  const teamCount = deriveTeamCount(fields.id);

  const handleOpen = () => {
    if (onActionClick) {
      onActionClick(fields.id);
    } else if (detailRoute) {
      startTransition(() => {
        router.push(
          detailRoute(fields.id) as Parameters<typeof router.push>[0],
        );
      });
    }
  };

  return (
    <div
      style={{ animationDelay: `${Math.min((index % 20) * 0.03, 0.6)}s` }}
      className={cn(
        "group bg-card animate-in fade-in slide-in-from-bottom-2 relative flex w-full min-w-0 flex-col items-center gap-1",
        "rounded-xl border border-[rgba(255,255,255,.14)] px-[clamp(10px,1vw,16px)] pt-[clamp(11px,1.5vh,16px)] pb-[clamp(13px,1.8vh,19px)] text-center",
        "backdrop-blur-[12px] backdrop-saturate-[1.2]",
        "shadow-[0_14px_34px_rgba(0,0,0,.35)] transition-all duration-[240ms] ease-out",
        "hover:bg-foreground/5 hover:-translate-y-[7px] hover:border-[rgba(232,212,173,.6)]",
        "hover:shadow-[0_26px_56px_rgba(0,0,0,.25),0_0_34px_rgba(232,212,173,.16)]",
      )}
    >
      {showCheckbox && (
        <Checkbox
          id={`patient-grid-${fields.id}-checkbox`}
          name={`patient-grid-${fields.id}-checkbox`}
          checked={selected}
          onCheckedChange={(checked) =>
            onToggleSelect?.(fields.id, checked === true)
          }
          onClick={(e) => e.stopPropagation()}
          className="bg-background border-primary absolute top-2 left-2 z-10"
        />
      )}

      <button
        type="button"
        onClick={handleOpen}
        disabled={isPending}
        aria-busy={isPending}
        className={cn(
          "flex w-full min-w-0 flex-col items-center gap-1",
          isPending && "cursor-wait opacity-70",
        )}
      >
        {/* top row — team stack or NEW badge, school pill, triage flag. Grid
          (not flex justify-between) so the school pill is genuinely
          centered regardless of how the left slot and triage badge widths
          compare. Cards are one-per-row on mobile now, so there's room for
          all three back in a single row at every breakpoint. */}
        <div className="grid min-h-[29px] w-full grid-cols-[1fr_auto_1fr] items-center gap-1.5">
          <div className="justify-self-start">
            {teamCount > 0 ? (
              <TeamAvatarStack
                otherCount={teamCount}
                currentProviderAvatarUrl={currentProviderAvatarUrl}
                currentProviderInitial={currentProviderInitial}
              />
            ) : (
              isNew && (
                <span className="bg-primary text-primary-foreground flex size-[22px] shrink-0 items-center justify-center rounded-full text-[7px] font-bold tracking-wide shadow-sm">
                  NEW
                </span>
              )
            )}
          </div>

          {(fields.schoolNickname || fields.schoolName) && (
            <span className="text-primary hover:bg-primary hover:text-primary-foreground bg-primary/10 max-w-[11em] min-w-0 justify-self-center truncate rounded-full px-[0.66em] py-[0.42em] text-[9px] font-bold tracking-wide uppercase transition-colors">
              {fields.schoolNickname || fields.schoolName}
            </span>
          )}

          <Badge
            variant={
              isLit
                ? TRIAGE_BADGE_VARIANT_LIT[tier]
                : TRIAGE_BADGE_VARIANT[tier]
            }
            className="shrink-0 justify-self-end px-[0.8em] py-[0.42em] text-[9.6px] font-bold tracking-wide transition-transform group-hover:scale-[1.06]"
          >
            {TRIAGE_TIER_LABELS[tier]}
          </Badge>
        </div>

        {/* the face */}
        <Avatar className="size-20 shadow-[0_0_0_1.5px_rgba(232,212,173,.55),0_10px_24px_rgba(0,0,0,.4)] transition-transform duration-[240ms] ease-out group-hover:scale-[1.07] group-hover:shadow-[0_0_0_2px_rgba(246,231,196,.95),0_14px_32px_rgba(0,0,0,.5)]">
          <AvatarImage
            src={fields.avatarUrl ?? undefined}
            alt={fields.patientName}
            className="transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>

        <b className="text-foreground text-[15.5px] font-extrabold tracking-[-.2px]">
          {fields.patientName || "Unknown"}
        </b>
        <span className="text-muted-foreground group-hover:text-foreground/80 text-[12.4px] font-bold transition-colors">
          Active {compactTimeAgo(fields.time || "")} ago
        </span>

        <span className="border-foreground/20 bg-foreground/10 text-foreground group-hover:bg-primary mt-[.35em] inline-flex items-center gap-[.4em] rounded-full border px-[1.15em] py-[.55em] text-[12.8px] font-extrabold shadow-[0_8px_20px_rgba(0,0,0,.2)] transition-all group-hover:scale-[1.04] group-hover:border-[var(--gold-hi)] group-hover:text-[#161207]">
          {isPending ? (
            <>
              Opening
              <Loader2 className="size-3 animate-spin" strokeWidth={2.8} />
            </>
          ) : (
            <>
              Open
              <ChevronRight className="size-3" strokeWidth={2.8} />
            </>
          )}
        </span>
      </button>
    </div>
  );
}
