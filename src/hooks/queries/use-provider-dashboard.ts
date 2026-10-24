"use client";

import { useQuery } from "@tanstack/react-query";
import {
  loadCampusDirectory,
  loadProviderHome,
} from "@/services/provider/dashboard";
import { resultsApi } from "@/lib/v2/results";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";

const V2 = QUERY_KEYS.v2;

/** Public campus directory (names, nicknames, logos), cached for a while. */
export const useCampusDirectory = (enabled = true) =>
  useQuery({
    queryKey: V2.campusDirectory,
    queryFn: loadCampusDirectory,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });

/** Campuses the provider serves, with their results (the home roll). */
export const useProviderHome = (enabled = true) => {
  const directory = useCampusDirectory(enabled);
  return useQuery({
    queryKey: V2.myCampuses,
    queryFn: () => loadProviderHome(directory.data ?? {}),
    enabled: enabled && !!directory.data,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/** Students needing attention, untreated and oldest first, across campuses. */
export const useProviderUrgentResults = (enabled = true) =>
  useQuery({
    queryKey: V2.urgentResults,
    queryFn: () => resultsApi.urgent(),
    staleTime: 60 * 1000,
    enabled,
  });
