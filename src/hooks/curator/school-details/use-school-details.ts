"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { compactTimeAgo } from "@/lib/utils/shared/time-ago";
import { useCuratorSchoolSearch } from "../school-search/use-school-search";
import { useSchoolData } from "../school/use-school-data";
import { useSchoolUI } from "../school/use-school-ui";
import { useSchoolActions } from "../school/use-school-actions";
import { useSchoolIcons } from "../school/use-school-icons";
import { useSchoolDerived } from "../school/use-school-derived";
import { useSchoolIconHandlers } from "../school/use-school-icon-handlers";
import type { SchoolTab } from "@/lib/types/components/curator/school-details/school-details";

export function useCuratorSchoolDetails() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;

  const schoolUI = useSchoolUI();
  const schoolData = useSchoolData(schoolId);
  const schoolIconsState = useSchoolIcons();

  const { school, patients, providers, invalidateSchoolProviders } = schoolData;
  const { icons, addOrUpdateIcon } = schoolIconsState;
  const {
    searchQuery,
    appliedSearchQuery,
    activeTab,
    selectedProviderEmail,
    editingIcon,
    setShowAddIconWizard,
    setEditingIcon,
    setShowDisableModal,
  } = schoolUI;

  const schoolActions = useSchoolActions(
    schoolId,
    school,
    router,
    schoolData.disableSchool,
    schoolData.invalidateSchool,
    setShowDisableModal,
  );

  const { filteredPatients, schoolIcons, tabs, selectedProvider } =
    useSchoolDerived({
      school,
      patients,
      providers,
      icons,
      appliedSearchQuery,
      selectedProviderEmail,
    });

  const searchResult = useCuratorSchoolSearch({
    searchQuery,
    activeTab: activeTab as SchoolTab,
    patients,
    schoolIcons,
    providers,
  });

  const { handleIconComplete } = useSchoolIconHandlers({
    addOrUpdateIcon,
    editingIcon,
    schoolId: school ? String(school.id) : null,
    setShowAddIconWizard,
    setEditingIcon,
  });

  const handleDisableSchool = useCallback(
    () => setShowDisableModal(true),
    [setShowDisableModal],
  );

  const loadProviders = useCallback(() => {
    invalidateSchoolProviders();
  }, [invalidateSchoolProviders]);

  return {
    router,
    schoolId,
    ...schoolUI,
    ...schoolData,
    ...schoolActions,
    ...searchResult,
    patients: filteredPatients,
    icons: schoolIcons,
    tabs,
    selectedProvider,
    handleDisableSchool,
    handleIconComplete,
    loadProviders,
    compactTimeAgo,
    localActiveFilters: searchResult.localActiveFilters,
    toggleFilter: searchResult.toggleFilter,
    removeFilter: searchResult.removeFilter,
    clearFilters: searchResult.clearFilters,
  };
}

export type CuratorSchoolDetailsState = ReturnType<
  typeof useCuratorSchoolDetails
>;
