"use client";

import { useQuery } from "@tanstack/react-query";
import { catalogueCurator } from "@/lib/v2/curator/catalogue";

/** Campus types and the shared location list, for the campus forms. Both change rarely. */
export function useCampusReference(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;

  const typesQuery = useQuery({
    queryKey: ["campus-types"],
    queryFn: () => catalogueCurator.campusTypes(),
    staleTime: 30 * 60 * 1000,
    enabled,
  });

  const locationsQuery = useQuery({
    queryKey: ["locations"],
    queryFn: () => catalogueCurator.locations(),
    staleTime: 10 * 60 * 1000,
    enabled,
  });

  return {
    campusTypes: typesQuery.data ?? [],
    locations: locationsQuery.data ?? [],
    isLoading: typesQuery.isLoading || locationsQuery.isLoading,
  };
}
