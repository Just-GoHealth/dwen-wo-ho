"use client";

import { useTheme } from "next-themes";
import { useAtom, useSetAtom } from "jotai";
import {
  activeSchoolAtom,
  activeStatusAtom,
  searchQueryAtom,
  appliedSearchQueryAtom,
  profileOpenAtom,
} from "@/atoms/new-provider";
import { isProviderNotificationSheetOpenAtom } from "@/atoms/notification";
import { PROVIDER_SEARCH_QUICK_FILTERS } from "@/lib/constants/components/provider/workspace/search";
import {
  useProviderHome,
  useProviderUrgentResults,
} from "@/hooks/queries/use-provider-dashboard";
import type { PatientCase } from "@/lib/types/api/patient-results";
import type { ProviderCampusSummary } from "@/lib/types/api/provider-dashboard";
import { useLocalActiveFilters } from "@/hooks/components/shared/filters/use-local-active-filters";
import {
  filterProviderDashboardPatients,
  countProviderPatientsForChip,
} from "@/lib/utils/provider/patient-filters";
import { useProviderSearchConfig } from "../search-config/use-search-config";
import { useProviderDashboardMobile } from "../dashboard-mobile/use-dashboard-mobile";
import { useProviderDashboardNotifications } from "../dashboard-notifications/use-dashboard-notifications";
import { useProviderDashboardProfileEdit } from "../dashboard-profile-edit/use-dashboard-profile-edit";

export type ProviderDashboardState = ReturnType<typeof useProviderDashboard>;

/**
 * Provider home. `enabled` is false until `GET /providers/me` says the
 * provider is approved (`next: HOME`) — before that, campus results 404.
 */
export default function useProviderDashboard(enabled = true) {
  const {
    data: home,
    isLoading: isInitLoading,
    isError: isInitError,
    error: initError,
  } = useProviderHome(enabled);

  const apiPatients: PatientCase[] = home?.patients ?? [];
  const apiSchools: ProviderCampusSummary[] = home?.schools ?? [];

  const [activeSchool, setActiveSchool] = useAtom(activeSchoolAtom);
  const [activeStatus, setActiveStatus] = useAtom(activeStatusAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [appliedSearchQuery, setAppliedSearchQuery] = useAtom(
    appliedSearchQueryAtom,
  );
  const { localActiveFilters, toggleFilter, clearFilters, removeFilter } =
    useLocalActiveFilters();

  const setNotifOpen = useSetAtom(isProviderNotificationSheetOpenAtom);
  const [profileOpen, setProfileOpen] = useAtom(profileOpenAtom);

  const {
    profileData,
    editOpen,
    setEditOpen,
    editFieldKey,
    setEditFieldKey,
    editFieldLabel,
    setEditFieldLabel,
    editValue,
    setEditValue,
    openEdit,
    saveEdit,
    isSaving,
    uploadAvatar,
    isUploadingAvatar,
    specialtyItems,
  } = useProviderDashboardProfileEdit();

  const {
    notifications,
    unreadCount,
    markAllRead,
    markOneRead,
    isMarkingRead,
    isMarkingAllRead,
  } = useProviderDashboardNotifications(enabled);

  const handleSelectSchool = (id: string | number) => {
    setActiveSchool(String(id));
    setActiveStatus("all");
  };

  const handleClearSchool = () => {
    setActiveSchool("all");
    setActiveStatus("all");
  };

  const filteredPatients = filterProviderDashboardPatients({
    patients: apiPatients,
    activeSchool,
    activeStatus,
    appliedSearchQuery,
    localActiveFilters,
  });

  const schoolLabel =
    apiSchools.find((s) => String(s.schoolId) === activeSchool)?.schoolName ??
    "";

  const { theme } = useTheme();

  const countForChip = (chipId: string) =>
    countProviderPatientsForChip({
      patients: apiPatients,
      activeSchool,
      appliedSearchQuery,
      chipId,
    });

  // Real per-campus "new" patient count — drives the campus story-ring
  // segments/badge on the home screen (not a fabricated/backend value).
  const newCountBySchool: Record<string, number> = {};
  for (const s of apiSchools) {
    newCountBySchool[String(s.schoolId)] = countProviderPatientsForChip({
      patients: apiPatients,
      activeSchool: String(s.schoolId),
      appliedSearchQuery: "",
      chipId: "new",
    });
  }

  const searchConfig = useProviderSearchConfig({
    searchQuery,
    setSearchQuery,
    appliedSearchQuery: "",
    setAppliedSearchQuery,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
    filteredPatients,
  });

  const {
    activePanel,
    setActivePanel,
    searchOpen,
    setSearchOpen,
    mobileTabs,
    panelVariants,
    panelTransition,
  } = useProviderDashboardMobile(setProfileOpen);

  const { data: urgentData } = useProviderUrgentResults(enabled);

  return {
    activeSchool,
    setActiveSchool,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    appliedSearchQuery,
    setAppliedSearchQuery,
    setNotifOpen,
    profileOpen,
    setProfileOpen,
    editOpen,
    setEditOpen,
    profileData,
    notifications,
    unreadCount,
    markAllRead,
    markOneRead,
    isMarkingRead,
    isMarkingAllRead,
    editFieldKey,
    setEditFieldKey,
    editFieldLabel,
    setEditFieldLabel,
    editValue,
    setEditValue,
    openEdit,
    saveEdit,
    handleSelectSchool,
    handleClearSchool,
    schools: apiSchools,
    filteredPatients,
    totalPatientCount: apiPatients.length,
    theme,
    countForChip,
    newCountBySchool,
    schoolLabel,
    quickFilters: PROVIDER_SEARCH_QUICK_FILTERS,
    isInitLoading,
    isInitError,
    initError,
    isSaving,
    isUploadingAvatar,
    uploadAvatar,
    specialtyItems,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
    searchConfig,
    activePanel,
    setActivePanel,
    searchOpen,
    setSearchOpen,
    mobileTabs,
    panelVariants,
    panelTransition,
    urgentData,
  };
}
