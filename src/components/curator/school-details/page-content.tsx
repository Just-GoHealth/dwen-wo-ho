"use client";

import { useState } from "react";
import type { Route } from "next";
import type { UrgentPatient } from "@/lib/types/entities/patient";
import { ROUTES, DYNAMIC_ROUTES } from "@/lib/constants/infra/routes";
import type { CuratorSchoolDetailsState } from "@/hooks/curator/school-details/use-school-details";
import {
  SchoolProfileBar,
  SchoolRollRow,
  SchoolProvidersSheet,
  UrgentPanel,
} from "@/components/curator/school-details";
import { Button } from "@/components/ui/button";
import { FilterTabBar } from "@/components/shared/filter-tab-bar/index";
import type { SchoolTab } from "@/lib/types/components/curator/school-details/school-details";
import type { SchoolDetailsPageContentProps } from "@/lib/types/components/curator/school-details/school-details";
import { Users } from "lucide-react";
import { deriveTriageTier, type TriageTier } from "@/lib/utils/shared/triage";
import SchoolDetailsModals from "@/components/curator/school-details/overlay-host";
import { SchoolDetailsBackNav } from "./back-nav";
import { SchoolDetailsSearchSection } from "./search-section";
import { SchoolDetailsTabContent } from "./tab-content";

export function SchoolDetailsPageContent({
  details,
}: SchoolDetailsPageContentProps<CuratorSchoolDetailsState>) {
  const {
    router,
    schoolId,
    school,
    patients,
    providers,
    icons: schoolIcons,
    urgentCare,
    campusLabel,
    patientsLoading,
    providersLoading,
    activeTab,
    searchQuery,
    setSearchQuery,
    appliedSearchQuery,
    setAppliedSearchQuery,
    setShowEditModal,
    setShowAddIconWizard,
    setEditingIcon,
    handleProviderClick,
    compactTimeAgo,
    suggestions,
    quickFilters,
    tabs,
    handleTabChange,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
  } = details;

  const [triageFilter, setTriageFilter] = useState<TriageTier | "all">("all");
  const [showProvidersSheet, setShowProvidersSheet] = useState(false);

  if (!school) return null;

  const visiblePatients =
    triageFilter === "all"
      ? patients
      : patients.filter(
          (p) =>
            deriveTriageTier(p.lockinScore, p.visibilityStatus) ===
            triageFilter,
        );

  return (
    <div className="bg-primary/10 animate-in fade-in flex min-h-screen flex-col duration-500">
      <div className="relative flex w-full flex-1 flex-col items-start lg:flex-row">
        <div className="relative z-10 flex w-full min-w-0 flex-1 flex-col px-4 py-6 sm:px-6">
          <SchoolDetailsBackNav
            onBack={() => router.push(ROUTES.curator.schools)}
          />

          <SchoolProfileBar
            school={school}
            providerCount={providers.length}
            onEditClick={() => setShowEditModal(true)}
            onOpenProviders={() => setShowProvidersSheet(true)}
          />

          <SchoolRollRow
            rollCount={patients.length}
            triageFilter={triageFilter}
            onTriageFilterChange={setTriageFilter}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FilterTabBar<SchoolTab>
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              renderActions={(tab) =>
                tab === "icons" ? (
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingIcon(null);
                      setShowAddIconWizard(true);
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 rounded-xl shadow-md"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Add Icon
                  </Button>
                ) : null
              }
              className="z-0 2xl:mb-8"
              activeTabLayoutId="school-details-filter"
            />

            <SchoolDetailsSearchSection
              activeTab={activeTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setAppliedSearchQuery={setAppliedSearchQuery}
              suggestions={suggestions}
              quickFilters={quickFilters}
              localActiveFilters={localActiveFilters}
              toggleFilter={toggleFilter}
              removeFilter={removeFilter}
              clearFilters={clearFilters}
              schoolId={schoolId}
              schoolIcons={schoolIcons}
              onProviderClick={handleProviderClick}
              setEditingIcon={setEditingIcon}
              setShowAddIconWizard={setShowAddIconWizard}
              router={router}
            />
          </div>

          <SchoolDetailsTabContent
            activeTab={activeTab}
            patients={visiblePatients}
            patientsLoading={patientsLoading}
            schoolId={schoolId}
            schoolName={school.nickname ?? ""}
            compactTimeAgo={compactTimeAgo}
            appliedSearchQuery={appliedSearchQuery}
            onViewPatient={(patientId) =>
              router.push(
                DYNAMIC_ROUTES.curator.patientDetails(
                  schoolId,
                  patientId,
                ) as Route,
              )
            }
            schoolIcons={schoolIcons}
            onIconClick={(icon) => {
              setEditingIcon(icon);
              setShowAddIconWizard(true);
            }}
            onAddFirstIcon={() => {
              setEditingIcon(null);
              setShowAddIconWizard(true);
            }}
            providers={providers}
            providersLoading={providersLoading}
            onProviderClick={handleProviderClick}
          />
        </div>

        <UrgentPanel
          className="border-border/50 bg-destructive/5 h-dvh w-full shrink-0 border-l lg:sticky lg:top-0 lg:h-screen lg:w-95"
          patients={urgentCare.patients}
          title="Urgent Care"
          emptyStateText="No urgent care patients"
          onPatientClick={(patient: UrgentPatient) =>
            router.push(
              DYNAMIC_ROUTES.curator.patientDetails(
                schoolId,
                patient.patientResultId,
              ) as Route,
            )
          }
        />
      </div>

      <SchoolProvidersSheet
        open={showProvidersSheet}
        onOpenChange={setShowProvidersSheet}
        providers={providers}
        campusLabel={campusLabel}
      />

      <SchoolDetailsModals details={details} />
    </div>
  );
}
