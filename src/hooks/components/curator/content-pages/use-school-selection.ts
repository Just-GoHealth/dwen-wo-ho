"use client";

import { useState, useMemo, useDeferredValue } from "react";
import { useQuery } from "@tanstack/react-query";
import { School } from "@/lib/types/entities/school";
import { SchoolPickerFilter } from "@/lib/types/components/shared/overlays";
import { campusesCurator } from "@/lib/v2/curator/campuses";
import type { CampusCardItem } from "@/lib/v2/curator/types";

const PICKER_PAGE_SIZE = 100;

/** The picker's School shape from a v2 campus card. */
function toSchool(campus: CampusCardItem): School {
  return {
    id: campus.id,
    name: campus.fullName,
    nickname: campus.nicknames[0],
    logo: campus.logo?.thumbnailUrl ?? campus.logo?.url,
    type: campus.type,
    motto: campus.motto ?? undefined,
  };
}

/** "COLLEGE" filters on the campus card; JHS/SHS on the campus-type code. */
function matchesFilter(campus: CampusCardItem, filter: SchoolPickerFilter) {
  if (filter === "All") return true;
  if (filter === "COLLEGE") return campus.card === "COLLEGE";
  return campus.type.toUpperCase().includes(filter);
}

export const useSchoolSelection = (
  isOpen: boolean,
  onSelect: (school: School | null) => void,
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SchoolPickerFilter>("All");
  // Searched on the server (name or nickname), so long lists stay complete.
  const q = useDeferredValue(searchQuery.trim());

  const { data, isLoading } = useQuery({
    queryKey: ["curator", "campus-picker", q],
    queryFn: () => campusesCurator.list({ q, size: PICKER_PAGE_SIZE }),
    enabled: isOpen,
    staleTime: 60 * 1000,
  });

  const filteredSchools = useMemo(
    () =>
      (data?.items ?? [])
        .filter((campus) => matchesFilter(campus, activeFilter))
        .map(toSchool),
    [data, activeFilter],
  );

  const handleSchoolClick = (school: School) => {
    onSelect(school);
  };

  const handleSelectPlatform = () => {
    onSelect(null); // null means platform/default
  };

  return {
    schools: filteredSchools,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filteredSchools,
    handleSchoolClick,
    handleSelectPlatform,
  };
};
