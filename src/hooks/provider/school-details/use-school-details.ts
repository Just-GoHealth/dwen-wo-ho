"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resultsApi } from "@/lib/v2/results";
import { nsmqApi } from "@/lib/v2/nsmq";
import { ApiError } from "@/lib/v2/http";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { useCampusDirectory } from "@/hooks/queries/use-provider-dashboard";
import { describeApiError } from "@/lib/utils/shared/api-error";
import type { Period, ResultFilters } from "@/lib/v2/types";

const V2 = QUERY_KEYS.v2;

const isNotFound = (error: unknown) =>
  error instanceof ApiError && error.code === "NOT_FOUND";

const noRetryOn4xx = (count: number, error: unknown) =>
  !(error instanceof ApiError && error.status < 500) && count < 2;

/**
 * One campus: results (with filters), the summary's period counts, and the
 * NSMQ care cases. A campus the provider can't see answers 404 — "not
 * available to you" (not attached, or still pending), not an error.
 */
export function useProviderSchoolDetails() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const schoolId = params.schoolId as string;
  const [period, setPeriod] = useState<Period | undefined>(undefined);
  const [activeOnly, setActiveOnly] = useState(true);
  const filters: ResultFilters = {
    period,
    active: activeOnly ? true : undefined,
  };

  const { data: directory } = useCampusDirectory();
  const campus = directory?.[schoolId];

  const resultsQuery = useQuery({
    queryKey: [...V2.campusResults(schoolId), filters],
    queryFn: () => resultsApi.list(schoolId, { ...filters, size: 100 }),
    enabled: !!schoolId,
    retry: noRetryOn4xx,
  });

  const summaryQuery = useQuery({
    queryKey: [...V2.campusSummary(schoolId), filters],
    queryFn: () => resultsApi.summary(schoolId, filters),
    enabled: !!schoolId && !isNotFound(resultsQuery.error),
    retry: noRetryOn4xx,
  });

  const careCasesQuery = useQuery({
    queryKey: V2.careCases(schoolId),
    queryFn: () => nsmqApi.careCases(schoolId),
    enabled: !!schoolId && !isNotFound(resultsQuery.error),
    retry: noRetryOn4xx,
  });

  const clearMutation = useMutation({
    mutationFn: ({ caseId, note }: { caseId: string; note: string }) =>
      nsmqApi.clear(caseId, note),
    onSuccess: (_, { caseId }) => {
      toast.success("911 cleared");
      void queryClient.invalidateQueries({ queryKey: V2.careCases(schoolId) });
      void queryClient.invalidateQueries({ queryKey: V2.clearances(caseId) });
    },
  });

  const clearCase = async (caseId: string, note: string) => {
    try {
      await clearMutation.mutateAsync({ caseId, note });
      return null;
    } catch (error) {
      const described = describeApiError(error);
      // Only the campus's NSMQ counsellor may clear a 911.
      if (described.code === "FORBIDDEN") {
        return {
          ...described,
          message: "Only this campus's NSMQ counsellor can clear a 911.",
        };
      }
      return described;
    }
  };

  return {
    router,
    schoolId,
    school: campus
      ? {
          name: campus.fullName,
          nickname: campus.nicknames[0],
          logo: campus.logo?.url,
          type: campus.type,
        }
      : null,
    results: resultsQuery.data?.items ?? [],
    total: resultsQuery.data?.total ?? 0,
    summary: summaryQuery.data ?? null,
    careCases: careCasesQuery.data ?? [],
    isLoading: resultsQuery.isLoading,
    notAvailable: isNotFound(resultsQuery.error),
    loadError:
      resultsQuery.error && !isNotFound(resultsQuery.error)
        ? describeApiError(resultsQuery.error)
        : null,
    period,
    setPeriod,
    activeOnly,
    setActiveOnly,
    clearCase,
    isClearing: clearMutation.isPending,
  };
}

/** Run detail (tag and reason are visible to providers) and a case's clearances. */
export const useStaffRun = (runId: string | null) =>
  useQuery({
    queryKey: V2.run(runId ?? ""),
    queryFn: () => nsmqApi.run(runId as string),
    enabled: !!runId,
    retry: noRetryOn4xx,
  });

export const useClearances = (caseId: string | null) =>
  useQuery({
    queryKey: V2.clearances(caseId ?? ""),
    queryFn: () => nsmqApi.clearances(caseId as string),
    enabled: !!caseId,
  });
