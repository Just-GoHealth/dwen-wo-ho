"use client";

import { m } from "motion/react";
import { UserRoundX } from "lucide-react";
import PatientGridCard from "@/components/shared/patient-card/patient-grid-card";
import { deriveTriageTier } from "@/lib/utils/shared/triage";
import type { TriageTier } from "@/lib/utils/shared/triage";
import type { ProviderDashboardState } from "@/hooks/provider/dashboard/use-dashboard";
import { ProviderDashboardSkeleton } from "@/components/provider/workspace/dashboard-skeleton";
import { useProviderProfile } from "@/hooks/provider/profile/use-profile";

interface PatientGridProps {
  filteredPatients: ProviderDashboardState["filteredPatients"];
  triageFilter: TriageTier | "all";
  isLoading?: boolean;
}

/**
 * Full-bleed patient roster grid for the provider home screen — replaces
 * `MainContent`'s vertical list with the mockup's `.pt-grid` layout (2
 * columns under 900px, 4 above). No page-level status filter here — a
 * patient's "new" state shows as a tag on its own card instead (see
 * `PatientGridCard`). The triage tier filter (911/Now/ASAP) is a
 * client-side-only refinement, since no backend field backs it yet.
 */
export function PatientGrid({
  filteredPatients,
  triageFilter,
  isLoading,
}: PatientGridProps) {
  const { provider } = useProviderProfile();
  const currentProviderInitial =
    provider?.providerName?.charAt(0).toUpperCase() || "P";

  if (isLoading) {
    return (
      <main className="no-scrollbar h-full overflow-y-auto px-4 py-4 pb-[clamp(112px,20vh,188px)]">
        <ProviderDashboardSkeleton />
      </main>
    );
  }

  const visiblePatients =
    triageFilter === "all"
      ? filteredPatients
      : filteredPatients.filter(
          (p) =>
            deriveTriageTier(p.score ?? null, p.status || "new") ===
            triageFilter,
        );

  return (
    <main className="no-scrollbar h-full overflow-y-auto px-4 py-4 pb-[clamp(112px,20vh,188px)]">
      <div className="grid grid-cols-2 gap-4 min-[900px]:grid-cols-4">
        {visiblePatients.map((patient, i) => (
          <PatientGridCard
            key={
              patient.patientId != null && patient.patientId !== 0
                ? `patient-${patient.patientId}`
                : `idx-${i}`
            }
            patient={patient}
            index={i}
            detailRoute={(id) => `/provider/patients/${id}`}
            showCheckbox={false}
            activeTriageFilter={triageFilter}
            currentProviderAvatarUrl={provider?.profilePhotoURL ?? undefined}
            currentProviderInitial={currentProviderInitial}
          />
        ))}
      </div>

      {visiblePatients.length === 0 && (
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center justify-center px-6 py-10"
        >
          <UserRoundX
            className="text-muted-foreground mb-4 h-16 w-16"
            strokeWidth={1.5}
          />
          <p className="text-foreground text-lg font-semibold">
            No patients found
          </p>
          <p className="text-muted-foreground mt-1.5 max-w-xs text-center text-sm leading-relaxed">
            Try adjusting your filters or campus selection.
          </p>
        </m.div>
      )}
    </main>
  );
}
