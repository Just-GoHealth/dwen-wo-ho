"use client";

import { useState, useMemo, useEffect } from "react";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import { useAtom } from "jotai";
import { curatorSchoolsAtom, SchoolWithExtras } from "@/atoms/curator-schools";
import { FilterType } from "@/lib/types/components/shared/school-filter";
import { School } from "@/lib/types/entities/school";
import type { CuratorSchool } from "@/lib/types/components/curator/schools/campus";
import { parseCampuses } from "@/lib/utils/curator/schools/parse-campuses";
import { SCHOOLS_LIST_SEARCH_QUICK_FILTERS } from "@/lib/constants/components/curator/schools/schools-list-search";
import { useLocalActiveFilters } from "@/hooks/components/shared/filters/use-local-active-filters";
import { matchesAllFilters } from "@/lib/utils/shared/matches-filter";
import { filterSchoolsBySearchQuery } from "@/lib/utils/shared/search-query";

export function getFirstCampus(campuses: School["campuses"]): string {
  const parsed = parseCampuses(campuses);
  return parsed.length > 0 ? parsed[0] : "";
}

// v2 campus types: JHS, SHS, and the college-card types (NMTC, COLLEGE,
// UNIVERSITY), which the "College" tab groups together.
function matchesTypeFilter(
  school: School & Pick<Partial<CuratorSchool>, "card">,
  filter: FilterType,
) {
  if (filter === "all") return true;
  if (filter === "COLLEGE") return school.card === "COLLEGE";
  return school.type === filter;
}

export function useCuratorSchools() {
  const [schoolsState, setSchoolsState] = useAtom(curatorSchoolsAtom);
  const { schools: cachedSchools, isLoading: atomLoading } = schoolsState;

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const { localActiveFilters, toggleFilter, clearFilters, removeFilter } =
    useLocalActiveFilters();

  const { useSchoolsWithRefetch } = useSchoolsQuery();
  const {
    data: allSchools = [],
    isLoading: schoolsLoading,
    isError,
  } = useSchoolsWithRefetch();

  // Use cached schools when available
  const mergedSchools = useMemo(() => {
    if (allSchools.length === 0) return [];
    if (cachedSchools.length > 0) {
      return cachedSchools;
    }
    return allSchools as SchoolWithExtras[];
  }, [allSchools, cachedSchools]);

  const filterCounts = useMemo(
    () => ({
      all: mergedSchools.length,
      JHS: mergedSchools.filter((s) => matchesTypeFilter(s, "JHS")).length,
      SHS: mergedSchools.filter((s) => matchesTypeFilter(s, "SHS")).length,
      COLLEGE: mergedSchools.filter((s) => matchesTypeFilter(s, "COLLEGE"))
        .length,
    }),
    [mergedSchools],
  );

  // Compute suggestions with active filters applied
  const suggestions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    let filtered = allSchools.filter((school) =>
      matchesAllFilters(school, localActiveFilters),
    );

    if (query) {
      filtered = filterSchoolsBySearchQuery(filtered, query, {
        includeCampuses: false,
      });
    }

    return filtered
      .map((school) => {
        const schoolWithExtras = school as SchoolWithExtras;
        return {
          id: school.id,
          name: school.name,
          avatarUrl: schoolWithExtras.logo ?? school.logo,
          type: school.type,
          slogan: schoolWithExtras.nickname || school.motto || "",
        };
      })
      .slice(0, query ? 5 : 4);
  }, [searchQuery, allSchools, localActiveFilters]);

  // Sync schools from React Query into the Jotai atom
  useEffect(() => {
    if (allSchools.length === 0) return;

    setSchoolsState((prev) => ({
      ...prev,
      isLoading: false,
      schools: allSchools.map((s) => ({ ...s }) as SchoolWithExtras),
    }));
  }, [allSchools, setSchoolsState]);

  const schoolsList = useMemo(() => {
    let filtered = mergedSchools.filter((school) =>
      matchesTypeFilter(school, activeFilter),
    );

    if (appliedSearchQuery.trim()) {
      filtered = filterSchoolsBySearchQuery(filtered, appliedSearchQuery);
    }

    return filtered;
  }, [mergedSchools, activeFilter, appliedSearchQuery]);

  return {
    schoolsList,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    appliedSearchQuery,
    setAppliedSearchQuery,
    filterCounts,
    isLoading: schoolsLoading || atomLoading,
    hasCachedData: cachedSchools.length > 0,
    isError,
    suggestions,
    quickFilters: SCHOOLS_LIST_SEARCH_QUICK_FILTERS,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
  };
}
