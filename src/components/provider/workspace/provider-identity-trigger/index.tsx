"use client";

import type { ReactNode } from "react";
import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface ProviderIdentityTriggerProps {
  providerName: string;
  avatarUrl?: string;
  fallback: string;
  onClick: () => void;
  /** Shown under the name when provided — e.g. total patient count on the
   * home screen. Omitted on screens where it isn't meaningful. */
  subtitle?: ReactNode;
  /** While true, shows skeleton placeholders instead of the (still empty)
   * real avatar/name/subtitle — avoids a flash of "PR" / "0 Patients". */
  isLoading?: boolean;
  /** Only true once the provider's application is actually approved — the
   * verify badge must never render unconditionally, since an unapproved
   * provider can still reach this component (see
   * guide/provider-design-refactor-backend-needs.md). */
  isVerified?: boolean;
}

/**
 * The clickable avatar/name/verified-badge trigger inside `ProviderGlassBar`
 * — shared by the provider home screen and the patient-detail screen so a
 * fix here (sizing, colors, the verify badge) never has to be duplicated
 * across both call sites again.
 */
export function ProviderIdentityTrigger({
  providerName,
  avatarUrl,
  fallback,
  onClick,
  subtitle,
  isLoading,
  isVerified,
}: ProviderIdentityTriggerProps) {
  if (isLoading) {
    return (
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Skeleton className="size-12 shrink-0 rounded-full sm:size-14 md:size-16 lg:size-20" />
        <div className="hidden min-w-0 flex-1 flex-col gap-1.5 sm:flex">
          <Skeleton className="h-7 w-32 md:h-9 md:w-40" />
          {subtitle !== undefined && <Skeleton className="h-3.5 w-20" />}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={providerName}
      className="flex min-w-0 items-center gap-2 sm:gap-3"
    >
      <Avatar className="size-12 shrink-0 border-2 border-[var(--gold-deep)] shadow-[0_10px_26px_rgba(26,16,12,.3)] sm:size-14 md:size-16 lg:size-20">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="text-base md:text-xl">
          {fallback}
        </AvatarFallback>
      </Avatar>
      <div className="hidden min-w-0 flex-1 flex-col gap-0.5 sm:flex">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="text-foreground min-w-0 truncate text-xl font-extrabold tracking-[-.5px] md:text-2xl lg:text-4xl">
            {providerName}
          </span>
          {isVerified && (
            <BadgeCheck
              className="size-5 shrink-0 text-[var(--gold-deep)]"
              strokeWidth={2.3}
            />
          )}
        </div>
        {subtitle && (
          <p className="truncate text-sm font-extrabold tracking-[-.2px] md:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </button>
  );
}
