"use client";

import useSchoolsQuery from "@/hooks/queries/use-schools";

import useSchoolDetailsQuery from "@/hooks/queries/use-school-details";

import { curatorErrorMessage } from "@/lib/v2/curator/errors";

export function useSchoolData(schoolId: string) {
  const { useSchool, invalidateSchool, disableSchool } = useSchoolsQuery();

  const schoolQuery = useSchool(schoolId);

  const school = schoolQuery.data ?? null;

  const {
    patientsOverviewData,
    patientsOverviewLoading,
    providersData,
    providersLoading,
    hubCounts,
    invalidateSchoolProviders,
    acceptAllResults,
    isAcceptingAll,
  } = useSchoolDetailsQuery(schoolId, {
    name: school?.name,
    nickname: school?.nickname,
  });

  const patients = patientsOverviewData?.patients ?? [];

  const providers = providersData ?? [];

  const urgentCare = patientsOverviewData?.urgentCare ?? {
    totalUrgentCarePatients: 0,

    patients: [],
  };

  const awaitingCount =
    hubCounts?.awaitingResults ?? patientsOverviewData?.awaitingCount ?? 0;

  const isLoading = schoolQuery.isLoading;

  const error = schoolQuery.error
    ? curatorErrorMessage(schoolQuery.error, "Failed to load school details")
    : null;

  // The campus's location, else its first site (v1's first "campus").
  const campusLabel = school
    ? (school.locationName ?? school.campuses?.[0] ?? null)
    : null;

  return {
    school,

    patients,

    providers,

    urgentCare,

    awaitingCount,

    hubCounts,

    isLoading,

    error,

    campusLabel,

    patientsLoading: patientsOverviewLoading,

    providersLoading,

    urgentLoading: patientsOverviewLoading,

    invalidateSchool,

    disableSchool,

    invalidateSchoolProviders,

    acceptAllResults,

    isAcceptingAll,
  };
}
