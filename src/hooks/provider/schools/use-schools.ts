"use client";

import { useMemo, useState } from "react";
import {
  useCampusDirectory,
  useProviderHome,
} from "@/hooks/queries/use-provider-dashboard";
import { useProviderMe } from "@/hooks/queries/use-provider-me";
import { isProviderApproved } from "@/lib/utils/auth/provider-next-route";
import { filterSchoolsBySearchQuery } from "@/lib/utils/shared/search-query";
import type { School } from "@/lib/types/entities/school";
import type { FilterType } from "@/lib/types/components/provider/schools";

/** The campuses this provider serves (inferred; see campus-membership.ts). */
export function useProviderSchools() {
  const { data: me, isLoading: isLoadingProfile } = useProviderMe();
  const approved = isProviderApproved(me?.next);
  const { data: home, isLoading } = useProviderHome(approved);
  const { data: directory } = useCampusDirectory(approved);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const cachedSchools = useMemo<School[]>(
    () =>
      (home?.schools ?? []).map((s) => {
        const campus = directory?.[s.schoolId];
        const latest = home?.patients
          .filter((p) => p.schoolId === s.schoolId)
          .sort((a, b) => b.time.localeCompare(a.time))[0];
        return {
          id: s.schoolId,
          name: s.schoolName,
          nickname: campus?.nicknames[0],
          logo: campus?.logo?.thumbnailUrl,
          type: campus?.type,
          motto: campus?.motto ?? undefined,
          totalPatients: s.count,
          studentCount: s.count,
          latestLockInDate: latest?.time,
          newPatientName:
            latest?.status === "new" ? latest.patientName : undefined,
        };
      }),
    [directory, home],
  );

  const schoolsList = useMemo(() => {
    const byType =
      activeFilter === "all"
        ? cachedSchools
        : cachedSchools.filter((school) => school.type === activeFilter);
    return searchQuery.trim()
      ? filterSchoolsBySearchQuery(byType, searchQuery)
      : byType;
  }, [activeFilter, cachedSchools, searchQuery]);

  return {
    schoolsList,
    cachedSchools,
    atomLoading: isLoading,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoadingProfile,
    isApproved: approved,
  };
}
