import type { PatientCase } from "@/lib/types/api/patient-results";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";
import { matchesFilterValue } from "@/lib/utils/shared/matches-filter";
import { anyFieldIncludesQuery } from "@/lib/utils/shared/search-query";

const SCORE_SORT_FILTER_IDS = new Set(["high-score", "low-score"]);

function isScoreSortFilter(filter: FilterOption): boolean {
  return SCORE_SORT_FILTER_IDS.has(filter.id);
}

function matchesPatientListFilter(
  patient: PatientCase,
  filter: FilterOption,
): boolean {
  if (isScoreSortFilter(filter)) return true;
  if (!filter.filterKey || !filter.filterValue) return true;

  const value = (patient as unknown as Record<string, unknown>)[
    filter.filterKey
  ];
  return matchesFilterValue(value, filter);
}

function matchesPatientListFilters(
  patient: PatientCase,
  filters: FilterOption[],
): boolean {
  return filters.every((filter) => matchesPatientListFilter(patient, filter));
}

function matchesSchoolFilter(
  patient: PatientCase,
  activeSchool: string,
): boolean {
  return activeSchool === "all" || String(patient.schoolId) === activeSchool;
}

function matchesStatusFilter(patient: PatientCase, status: string): boolean {
  return status === "all" || patient.status === status;
}

function matchesProviderSearchQuery(
  patient: PatientCase,
  appliedSearchQuery: string,
): boolean {
  const query = appliedSearchQuery.toLowerCase();
  return anyFieldIncludesQuery(
    [patient.patientName, patient.schoolName],
    query,
  );
}

function matchesProviderDashboardPatient(
  patient: PatientCase,
  {
    activeSchool,
    activeStatus,
    appliedSearchQuery,
    localActiveFilters,
  }: {
    activeSchool: string;
    activeStatus: string;
    appliedSearchQuery: string;
    localActiveFilters: FilterOption[];
  },
): boolean {
  return (
    matchesSchoolFilter(patient, activeSchool) &&
    matchesStatusFilter(patient, activeStatus) &&
    matchesProviderSearchQuery(patient, appliedSearchQuery) &&
    matchesPatientListFilters(patient, localActiveFilters)
  );
}

/** Most recently active patients float to the top of the roll. */
function sortByRecent(patients: PatientCase[]): PatientCase[] {
  return patients.toSorted(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );
}

export function filterProviderDashboardPatients({
  patients,
  activeSchool,
  activeStatus,
  appliedSearchQuery,
  localActiveFilters,
}: {
  patients: PatientCase[];
  activeSchool: string;
  activeStatus: string;
  appliedSearchQuery: string;
  localActiveFilters: FilterOption[];
}): PatientCase[] {
  const filtered = patients.filter((patient) =>
    matchesProviderDashboardPatient(patient, {
      activeSchool,
      activeStatus,
      appliedSearchQuery,
      localActiveFilters,
    }),
  );
  return sortByRecent(filtered);
}

function matchesProviderChipPatient(
  patient: PatientCase,
  activeSchool: string,
  appliedSearchQuery: string,
  chipId: string,
): boolean {
  return (
    matchesSchoolFilter(patient, activeSchool) &&
    matchesProviderSearchQuery(patient, appliedSearchQuery) &&
    matchesStatusFilter(patient, chipId)
  );
}

export function countProviderPatientsForChip({
  patients,
  activeSchool,
  appliedSearchQuery,
  chipId,
}: {
  patients: PatientCase[];
  activeSchool: string;
  appliedSearchQuery: string;
  chipId: string;
}): number {
  return patients.filter((patient) =>
    matchesProviderChipPatient(
      patient,
      activeSchool,
      appliedSearchQuery,
      chipId,
    ),
  ).length;
}

function sortPatientsByScore(
  patients: PatientCase[],
  direction: "asc" | "desc",
): PatientCase[] {
  return patients.toSorted((left, right) => {
    const leftScore = left.score ?? 0;
    const rightScore = right.score ?? 0;
    return direction === "desc"
      ? rightScore - leftScore
      : leftScore - rightScore;
  });
}

function applyScoreSortFilters(
  patients: PatientCase[],
  filters: FilterOption[],
): PatientCase[] {
  if (filters.some((filter) => filter.id === "high-score")) {
    return sortPatientsByScore(patients, "desc");
  }
  if (filters.some((filter) => filter.id === "low-score")) {
    return sortPatientsByScore(patients, "asc");
  }
  return patients;
}

export function buildProviderTopSuggestions(
  patients: PatientCase[],
  query: string,
  filters: FilterOption[],
): PatientCase[] {
  const normalizedQuery = query.toLowerCase().trim();
  let filtered = patients.filter((patient) =>
    matchesPatientListFilters(patient, filters),
  );

  if (normalizedQuery) {
    filtered = filtered.filter((patient) =>
      anyFieldIncludesQuery(
        [patient.patientName, patient.schoolName],
        normalizedQuery,
      ),
    );
  }

  filtered = applyScoreSortFilters(filtered, filters);
  return filtered.slice(0, normalizedQuery ? 5 : 4);
}
