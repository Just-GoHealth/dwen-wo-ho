"use client";

import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { m } from "motion/react";
import { UserRoundX } from "lucide-react";
import PatientGridCard from "@/components/shared/patient-card/patient-grid-card";
import { deriveTriageTier } from "@/lib/utils/shared/triage";
import type { TriageTier } from "@/lib/utils/shared/triage";
import type { ProviderDashboardState } from "@/hooks/provider/dashboard/use-dashboard";
import { ProviderDashboardSkeleton } from "@/components/provider/workspace/dashboard-skeleton";
import { useProviderProfile } from "@/hooks/provider/profile/use-profile";
import {
  patientGridVisibleCountAtom,
  patientGridScrollTopAtom,
} from "@/atoms/new-provider";

interface PatientGridProps {
  filteredPatients: ProviderDashboardState["filteredPatients"];
  triageFilter: TriageTier | "all";
  isLoading?: boolean;
}

/** How many cards render up front, and how many more each scroll-triggered
 * batch adds — the full roster is already fetched in one request (school
 * badge counts need it all), this only limits how much DOM renders at
 * once. */
const BATCH_SIZE = 20;

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

  // Persisted in atoms, not local state — a plain useState resets on
  // unmount, so opening a patient and pressing back re-mounted this grid
  // fresh, dropping the provider back at the top with only the first
  // batch rendered instead of wherever they'd scrolled to.
  const [visibleCount, setVisibleCount] = useAtom(patientGridVisibleCountAtom);
  const [savedScrollTop, setSavedScrollTop] = useAtom(patientGridScrollTopAtom);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const visiblePatients =
    triageFilter === "all"
      ? filteredPatients
      : filteredPatients.filter(
          (p) =>
            deriveTriageTier(p.score ?? null, p.status || "new") ===
            triageFilter,
        );

  // Restore whatever scroll position was saved before navigating away —
  // once, on mount, after the (already-restored) batch count has had a
  // chance to render enough cards to actually scroll to that offset.
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = savedScrollTop;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore once on mount only
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + BATCH_SIZE, visiblePatients.length),
          );
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visiblePatients.length, setVisibleCount]);

  if (isLoading) {
    return (
      <main className="no-scrollbar h-full overflow-y-auto px-4 py-4 pb-[clamp(112px,20vh,188px)]">
        <ProviderDashboardSkeleton />
      </main>
    );
  }

  const shownPatients = visiblePatients.slice(0, visibleCount);

  return (
    <main
      ref={mainRef}
      onScroll={(e) => setSavedScrollTop(e.currentTarget.scrollTop)}
      className="no-scrollbar h-full overflow-y-auto px-4 py-4 pb-[clamp(112px,20vh,188px)]"
    >
      <div className="grid grid-cols-2 gap-4 max-[480px]:grid-cols-1 min-[900px]:grid-cols-4">
        {shownPatients.map((patient, i) => (
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

      {visibleCount < visiblePatients.length && (
        <div ref={sentinelRef} className="h-px w-full" />
      )}

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
