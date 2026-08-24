import type { SchoolDetailSearchSuggestion } from "@/lib/types/components/curator/school-search";
import type { SchoolTab } from "@/lib/types/components/curator/school-details/school-details";
import type { SchoolPatientRecord } from "@/lib/types/components/curator/school-details/school-details";
import type { SchoolIcon } from "@/lib/types/entities/school";
import type { SchoolProvider } from "@/lib/types/entities/provider";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";
import { formatProviderName } from "@/lib/utils/shared/provider-name";
import { compactTimeAgo } from "@/lib/utils/shared/time-ago";
import { matchesAllFilters } from "@/lib/utils/shared/matches-filter";
import { includesQuery } from "@/lib/utils/shared/search-query";

const TAB_BUILDERS: Record<
  Exclude<SchoolTab, never>,
  (args: {
    query: string;
    activeFilters: FilterOption[];
    limit: number;
    patients: SchoolPatientRecord[];
    schoolIcons: SchoolIcon[];
    providers: SchoolProvider[];
  }) => SchoolDetailSearchSuggestion[]
> = {
  patients: ({ patients, query, activeFilters, limit }) =>
    buildPatientSuggestions(patients, query, activeFilters, limit),
  icons: ({ schoolIcons, query, activeFilters, limit }) =>
    buildIconSuggestions(schoolIcons, query, activeFilters, limit),
  providers: ({ providers, query, activeFilters, limit }) =>
    buildProviderSuggestions(providers, query, activeFilters, limit),
};

export function buildCuratorSchoolTabSuggestions({
  activeTab,
  query,
  activeFilters,
  patients,
  schoolIcons,
  providers,
  limit,
}: {
  activeTab: SchoolTab;
  query: string;
  activeFilters: FilterOption[];
  patients: SchoolPatientRecord[];
  schoolIcons: SchoolIcon[];
  providers: SchoolProvider[];
  limit: number;
}): SchoolDetailSearchSuggestion[] {
  const builder = TAB_BUILDERS[activeTab];
  if (!builder) return [];

  return builder({
    query,
    activeFilters,
    limit,
    patients,
    schoolIcons,
    providers,
  });
}

function derivePatientSuggestionStatus(
  patient: SchoolPatientRecord,
): SchoolDetailSearchSuggestion["status"] {
  const hasTreatingProviders = Boolean(patient.treatingProviders?.length);
  if (hasTreatingProviders) return "action";
  return patient.visibilityStatus === "SEEN" ? "follow-up" : "new";
}

function mapPatientToSuggestion(
  patient: SchoolPatientRecord,
): SchoolDetailSearchSuggestion {
  return {
    // undefined (never patientId) when there's no submitted result yet -
    // patientId is not a resultId, and openPatientFromSuggestion navigates
    // to a result-detail route, so substituting it here would send a
    // non-numeric id to a backend endpoint that requires one
    id: patient.id ?? undefined,
    name: patient.patientName,
    score: patient.lockinScore ?? 0,
    status: derivePatientSuggestionStatus(patient),
    time: compactTimeAgo(patient.createdAt || ""),
    preview: patient.comment || "",
  };
}

function mapIconToSuggestion(icon: SchoolIcon): SchoolDetailSearchSuggestion {
  return {
    id: icon.id,
    name: icon.name,
    avatarUrl:
      icon.logoUrl || (typeof icon.photo === "string" ? icon.photo : undefined),
    type: icon.type,
    slogan: icon.slogan || "",
    rank: icon.rank,
  };
}

function mapProviderToSuggestion(
  provider: SchoolProvider,
): SchoolDetailSearchSuggestion {
  const providerName = formatProviderName(
    provider.providerName,
    provider.providerTitle,
  );

  return {
    email: provider.email,
    name: providerName,
    score: 0,
    status: provider.applicationStatus === "APPROVED" ? "new" : "ignored",
    time: provider.specialty || "",
    preview: provider.applicationStatus || "",
  };
}

function shouldIncludeSuggestion<T>(
  item: T,
  normalizedQuery: string,
  activeFilters: FilterOption[],
  matchesQuery: (item: T, normalizedQuery: string) => boolean,
): boolean {
  return (
    matchesAllFilters(item as object, activeFilters) &&
    matchesQuery(item, normalizedQuery)
  );
}

function collectMatchingSuggestions<T>({
  items,
  query,
  activeFilters,
  limit,
  matchesQuery,
  toSuggestion,
}: {
  items: T[];
  query: string;
  activeFilters: FilterOption[];
  limit: number;
  matchesQuery: (item: T, normalizedQuery: string) => boolean;
  toSuggestion: (item: T) => SchoolDetailSearchSuggestion;
}): SchoolDetailSearchSuggestion[] {
  const normalizedQuery = query.toLowerCase().trim();
  const results: SchoolDetailSearchSuggestion[] = [];

  for (const item of items) {
    if (results.length >= limit) break;
    if (
      !shouldIncludeSuggestion(
        item,
        normalizedQuery,
        activeFilters,
        matchesQuery,
      )
    ) {
      continue;
    }
    results.push(toSuggestion(item));
  }

  return results;
}

function buildPatientSuggestions(
  patients: SchoolPatientRecord[],
  query: string,
  activeFilters: FilterOption[],
  limit: number,
): SchoolDetailSearchSuggestion[] {
  return collectMatchingSuggestions({
    items: patients,
    query,
    activeFilters,
    limit,
    matchesQuery: (patient, normalizedQuery) =>
      includesQuery(patient.patientName, normalizedQuery),
    toSuggestion: mapPatientToSuggestion,
  });
}

function buildIconSuggestions(
  schoolIcons: SchoolIcon[],
  query: string,
  activeFilters: FilterOption[],
  limit: number,
): SchoolDetailSearchSuggestion[] {
  return collectMatchingSuggestions({
    items: schoolIcons,
    query,
    activeFilters,
    limit,
    matchesQuery: (icon, normalizedQuery) =>
      includesQuery(icon.name, normalizedQuery),
    toSuggestion: mapIconToSuggestion,
  });
}

function buildProviderSuggestions(
  providers: SchoolProvider[],
  query: string,
  activeFilters: FilterOption[],
  limit: number,
): SchoolDetailSearchSuggestion[] {
  return collectMatchingSuggestions({
    items: providers,
    query,
    activeFilters,
    limit,
    matchesQuery: (provider, normalizedQuery) => {
      const providerName = formatProviderName(
        provider.providerName,
        provider.providerTitle,
      );
      return includesQuery(providerName, normalizedQuery);
    },
    toSuggestion: mapProviderToSuggestion,
  });
}
