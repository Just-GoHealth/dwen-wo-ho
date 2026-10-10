"use client";

import { useMemo } from "react";

import { School } from "@/lib/types/entities/school";

import { SchoolPatientRecord } from "@/lib/types/components/curator/school-details/school-details";

import useSchoolsQuery from "@/hooks/queries/use-schools";

import useSchoolDetailsQuery from "@/hooks/queries/use-school-details";

import { parseCampuses } from "@/lib/utils/curator/schools/parse-campuses";

export function useSchoolData(schoolId: string) {
  const { useSchool, invalidateSchool, disableSchool } = useSchoolsQuery();

  const {
    patientsOverviewData,
    patientsOverviewLoading,
    providersData,
    providersLoading,
    invalidateSchoolProviders,
  } = useSchoolDetailsQuery(schoolId);

  const schoolQuery = useSchool(schoolId);

  const rawSchool = schoolQuery.data as
    (School & { campuses?: unknown }) | undefined;

  const school = useMemo(() => {
    if (!rawSchool) return null;

    const s = { ...rawSchool } as School;

    if (rawSchool.campuses) {
      s.campuses = parseCampuses(rawSchool.campuses as string[]);
    }

    return s;
  }, [rawSchool]);

  const overviewData = patientsOverviewData;

  const patients = (overviewData?.patients as SchoolPatientRecord[]) ?? [];

  const providers = providersData ?? [];

  const urgentCare = overviewData?.urgentCare ?? {
    totalUrgentCarePatients: 0,

    patients: [],
  };

  const isLoading = schoolQuery.isLoading;

  const error = schoolQuery.error
    ? ((schoolQuery.error as Error).message ?? "Failed to load school details")
    : null;

  const campusLabel = school ? parseCampuses(school.campuses)[0] : null;

  return {
    school,

    patients,

    providers,

    urgentCare,

    isLoading,

    error,

    campusLabel,

    patientsLoading: patientsOverviewLoading,

    providersLoading,

    urgentLoading: patientsOverviewLoading,

    invalidateSchool,

    disableSchool,

    invalidateSchoolProviders,
  };
}
