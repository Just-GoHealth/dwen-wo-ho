"use client";

import { useEffect, useRef } from "react";
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
  useProviderDashboardInit,
  useUploadAvatarMutation,
  useProviderUrgentPatients,
} from "@/hooks/queries/use-provider-dashboard";
import type { PatientCase } from "@/lib/types/api/patient-results";
import type { ProviderAssociatedSchool } from "@/lib/types/api/providers";
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

export default function useProviderDashboard() {
  const {
    data: dashboardInit,
    isLoading: isInitLoading,
    isError: isInitError,
    error: initError,
  } = useProviderDashboardInit();
  const uploadAvatarMutation = useUploadAvatarMutation();

  const apiPatients: PatientCase[] = dashboardInit?.patients ?? [];
  const apiSchools: ProviderAssociatedSchool[] = dashboardInit?.schools ?? [];

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
    setProfileData,
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
    isUpdatingPhoneNumber,
    updatePhoneNumber,
  } = useProviderDashboardProfileEdit();

  useEffect(() => {
    if (dashboardInit?.profile) {
      setProfileData((prev) => ({ ...prev, ...dashboardInit.profile }));
    }
  }, [dashboardInit?.profile, setProfileData]);

  const {
    notifications,
    setNotifications,
    unreadCount,
    markAllRead,
    markOneRead,
    clearAllNotifications,
    deleteNotification,
    isMarkingRead,
    isMarkingAllRead,
    isDeleting,
    isClearing,
  } = useProviderDashboardNotifications();

  const handleSelectSchool = (id: string | number) => {
    setActiveSchool(String(id));
    setActiveStatus("all");
  };

  const handleClearSchool = () => {
    setActiveSchool("all");
    setActiveStatus("all");
  };

  // As soon as a new result comes in for a school, jump the active campus
  // tab to it so the provider sees it immediately rather than having to
  // notice the story-ring badge and switch manually. Skips the initial
  // population (prevIds starts empty) so it doesn't hijack the very first
  // load, and only reacts to a genuinely new patient id appearing.
  const prevPatientIdsRef = useRef<Set<string | number> | null>(null);
  useEffect(() => {
    const currentIds = new Set(apiPatients.map((p) => p.patientId));
    const prevIds = prevPatientIdsRef.current;

    if (prevIds) {
      const newlyArrived = apiPatients.find(
        (p) => p.schoolId != null && !prevIds.has(p.patientId),
      );
      if (newlyArrived) {
        setActiveSchool(String(newlyArrived.schoolId));
        setActiveStatus("all");
      }
    }

    prevPatientIdsRef.current = currentIds;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the patient list itself changes
  }, [apiPatients]);

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

  const { data: urgentData } = useProviderUrgentPatients();

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
    setProfileData,
    notifications,
    setNotifications,
    unreadCount,
    markAllRead,
    markOneRead,
    clearAllNotifications,
    deleteNotification,
    isMarkingRead,
    isMarkingAllRead,
    isDeleting,
    isClearing,
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
    isUploadingAvatar: uploadAvatarMutation.isPending,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    isUpdatingPhoneNumber,
    updatePhoneNumber,
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
