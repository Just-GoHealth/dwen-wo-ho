"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { schoolsService } from "@/services/curator/schools";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { toastCuratorError } from "@/lib/v2/curator/errors";

export default function useSchoolDetailsQuery(
  schoolId: string,
  school: { name?: string; nickname?: string } = {},
) {
  const queryClient = useQueryClient();

  const { data: patientsOverviewData, isLoading: patientsOverviewLoading } =
    useQuery({
      queryKey: QUERY_KEYS.schoolPatientsOverview(schoolId),
      queryFn: () => schoolsService.getPatientsOverview(schoolId, school),
      enabled: !!schoolId,
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

  const { data: providersData, isLoading: providersLoading } = useQuery({
    queryKey: QUERY_KEYS.schoolProviders(schoolId),
    queryFn: () => schoolsService.getSchoolProviders(schoolId),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Counts per hub card (awaitingResults, justIn, hosts, ...).
  const { data: hubData } = useQuery({
    queryKey: [QUERY_KEYS.schoolDetail, "hub", schoolId],
    queryFn: () => schoolsService.getSchoolHub(schoolId),
    enabled: !!schoolId,
    staleTime: 60 * 1000,
  });

  const invalidateSchoolProviders = useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.schoolProviders(schoolId),
      }),
    [queryClient, schoolId],
  );

  const acceptAllMutation = useMutation({
    mutationFn: () => schoolsService.acceptAllResults(schoolId),
    onSuccess: ({ accepted }) => {
      toast.success(
        accepted === 1 ? "1 result accepted" : `${accepted} results accepted`,
      );
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.schoolPatientsOverview(schoolId),
      });
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.schoolDetail, "hub", schoolId],
      });
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to accept results" }),
  });

  return {
    patientsOverviewData,
    patientsOverviewLoading,
    providersData,
    providersLoading,
    hubCounts: hubData?.counts,
    invalidateSchoolProviders,
    acceptAllResults: acceptAllMutation.mutate,
    isAcceptingAll: acceptAllMutation.isPending,
  };
}
