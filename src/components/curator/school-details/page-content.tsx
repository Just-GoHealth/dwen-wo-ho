"use client";

import { useState } from "react";
import type { Route } from "next";
import { ROUTES, DYNAMIC_ROUTES } from "@/lib/constants/infra/routes";
import type { CuratorSchoolDetailsState } from "@/hooks/curator/school-details/use-school-details";
import {
  SchoolProfileBar,
  SchoolGlassBar,
  NextFixturePill,
  JoinCompetitionPill,
  SchoolAccessCodesSheet,
  SchoolProvidersSheet,
} from "@/components/curator/school-details";
import type { Team } from "@/lib/types/api/competitions";
import { useCurrentSchoolTeam } from "@/hooks/curator/competitions/use-current-school-team";
import { Button } from "@/components/ui/button";
import { FilterTabBar } from "@/components/shared/filter-tab-bar/index";
import type { SchoolTab } from "@/lib/types/components/curator/school-details/school-details";
import type { SchoolDetailsPageContentProps } from "@/lib/types/components/curator/school-details/school-details";
import { Users } from "lucide-react";
import { resolveTriageTier, type TriageTier } from "@/lib/utils/shared/triage";
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
  const [showAccessCodesSheet, setShowAccessCodesSheet] = useState(false);
  const { team } = useCurrentSchoolTeam(schoolId);
  // Set the moment "Join a competition" registers this school — lets the
  // rest of this page light up (Next Contest, Access Codes) without
  // waiting on the team-lookup query to refetch first.
  const [justRegisteredTeam, setJustRegisteredTeam] = useState<Team | null>(
    null,
  );
  const effectiveTeam = team ?? justRegisteredTeam;

  if (!school) return null;

  const visiblePatients =
    triageFilter === "all"
      ? patients
      : patients.filter(
          (p) =>
            resolveTriageTier(p.nsmqTag, p.lockinScore, p.visibilityStatus) ===
            triageFilter,
        );

  return (
    <div className="bg-app-gradient animate-in fade-in relative flex min-h-screen flex-col duration-500">
      <div className="relative flex w-full flex-1 flex-col items-start">
        <div className="relative z-10 flex w-full min-w-0 flex-1 flex-col px-4 py-6 pb-32 sm:px-6">
          <SchoolDetailsBackNav
            onBack={() => router.push(ROUTES.curator.schools)}
          />

          <SchoolProfileBar
            providerCount={providers.length}
            rollCount={patients.length}
            triageFilter={triageFilter}
            onTriageFilterChange={setTriageFilter}
            onOpenProviders={() => setShowProvidersSheet(true)}
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
      </div>

      <SchoolGlassBar
        school={school}
        onEditClick={() => setShowEditModal(true)}
        onOpenAccessCodes={() => setShowAccessCodesSheet(true)}
        fixturePill={
          effectiveTeam ? (
            <NextFixturePill
              teamId={effectiveTeam.id}
              fixtures={effectiveTeam.fixtures}
              campusName={effectiveTeam.campusName}
              status={effectiveTeam.status}
            />
          ) : (
            <JoinCompetitionPill
              schoolId={schoolId}
              onRegistered={setJustRegisteredTeam}
            />
          )
        }
      />

      <SchoolProvidersSheet
        open={showProvidersSheet}
        onOpenChange={setShowProvidersSheet}
        providers={providers}
        campusLabel={campusLabel}
      />

      <SchoolAccessCodesSheet
        open={showAccessCodesSheet}
        onOpenChange={setShowAccessCodesSheet}
        teamId={effectiveTeam?.id ?? null}
        teamName={school.nickname ?? school.name}
      />

      <SchoolDetailsModals details={details} />
    </div>
  );
}
