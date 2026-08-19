"use client";

import { useAtom } from "jotai";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/shared/notification-bell";
import { ProviderGlassBar } from "@/components/provider/workspace/provider-glass-bar";
import { ProviderIdentityTrigger } from "@/components/provider/workspace/provider-identity-trigger";
import { ProviderBrandMark } from "@/components/provider/workspace/provider-brand-mark";
import { CampusRingRow } from "@/components/provider/dashboard/campus-ring-row";
import { PatientGrid } from "@/components/provider/dashboard/patient-grid";
import { useProviderProfile } from "@/hooks/provider/profile/use-profile";
import { triageFilterAtom } from "@/atoms/new-provider";
import {
  TRIAGE_TIER_LABELS,
  TRIAGE_CHIP_VARIANT,
  TRIAGE_CHIP_VARIANT_LIT,
  type TriageTier,
} from "@/lib/utils/shared/triage";
import type { ProviderDashboardState } from "@/hooks/provider/dashboard/use-dashboard";

interface ProviderHomeShellProps {
  dashboard: ProviderDashboardState;
}

/**
 * New provider home screen — campus-switcher ring row, full-bleed patient
 * grid, and a bottom transparent identity/action bar. Matches `.pr-bar` in
 * guide/Bronze Fury A_33.html (`background:transparent`, no card/blur);
 * consumes `useProviderDashboard()` as-is, no hook changes required. Logout
 * lives in the profile dialog (opened by clicking the identity in the bar's
 * center) rather than a separate button here — no need to duplicate it.
 */
export function ProviderHomeShell({ dashboard }: ProviderHomeShellProps) {
  const [triageFilter, setTriageFilter] = useAtom(triageFilterAtom);

  const {
    activeSchool,
    handleSelectSchool,
    handleClearSchool,
    schools,
    totalPatientCount,
    filteredPatients,
    isInitLoading,
    profileData,
    setProfileOpen,
    newCountBySchool,
    unreadCount,
    setNotifOpen,
  } = dashboard;

  const { name = "", title = "", avatarUrl = "" } = profileData ?? {};
  const fallback = name?.charAt(0).toUpperCase() || "PR";
  const { provider } = useProviderProfile();
  const isVerified = provider?.applicationStatus === "APPROVED";

  return (
    <div className="bg-app-gradient relative flex h-dvh w-full flex-col overflow-hidden">
      <NotificationBell
        unreadCount={unreadCount}
        onOpenNotifs={() => setNotifOpen(true)}
        containerClassName="absolute top-4 right-4 z-50"
      />

      <CampusRingRow
        activeSchool={activeSchool}
        handleSelectSchool={handleSelectSchool}
        handleClearSchool={handleClearSchool}
        schools={schools}
        newCountBySchool={newCountBySchool}
        isLoading={isInitLoading}
      />

      <div className="min-h-0 flex-1">
        <PatientGrid
          filteredPatients={filteredPatients}
          triageFilter={triageFilter}
          isLoading={isInitLoading}
        />
      </div>

      <ProviderGlassBar
        className="absolute inset-x-0 bottom-0"
        left={
          <ProviderIdentityTrigger
            providerName={`${title} ${name}`.trim()}
            avatarUrl={avatarUrl}
            fallback={fallback}
            onClick={() => setProfileOpen(true)}
            isLoading={isInitLoading}
            isVerified={isVerified}
            subtitle={
              <>
                <span className="text-foreground/90">{totalPatientCount}</span>{" "}
                <span className="text-foreground/60">Patients</span>
              </>
            }
          />
        }
        center={
          <div className="flex items-center gap-1 sm:gap-2">
            {(Object.keys(TRIAGE_TIER_LABELS) as TriageTier[]).map((tier) => {
              const isOn = triageFilter === tier;
              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() =>
                    setTriageFilter((prev) => (prev === tier ? "all" : tier))
                  }
                  className="transition-transform hover:-translate-y-0.5"
                >
                  <Badge
                    variant={
                      isOn
                        ? TRIAGE_CHIP_VARIANT_LIT[tier]
                        : TRIAGE_CHIP_VARIANT[tier]
                    }
                    className="cursor-pointer px-2 py-1 text-[10px] font-bold tracking-[.08em] sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[.14em]"
                  >
                    {TRIAGE_TIER_LABELS[tier]}
                  </Badge>
                </button>
              );
            })}
          </div>
        }
        right={
          <div className="hidden sm:block">
            <ProviderBrandMark />
          </div>
        }
      />
    </div>
  );
}
