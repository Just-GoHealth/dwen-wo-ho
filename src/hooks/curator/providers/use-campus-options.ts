"use client";

import { useQuery } from "@tanstack/react-query";
import { campusesCurator } from "@/lib/v2/curator/campuses";
import { collectPages } from "@/services/curator/providers/list";
import type { AssociatedSchool } from "@/lib/types/entities/partners";

/** Every active campus, as the add-school pickers list them. */
export function useCampusOptions(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["curator-campus-options"],
    queryFn: async (): Promise<AssociatedSchool[]> => {
      const campuses = await collectPages((page) =>
        campusesCurator.list({ page, size: 100 }),
      );
      return campuses.map((campus) => ({
        id: campus.id,
        name: campus.fullName,
        logo: campus.logo?.thumbnailUrl ?? campus.logo?.url ?? undefined,
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}
