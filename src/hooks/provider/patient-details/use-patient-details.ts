"use client";

import { useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resultsApi } from "@/lib/v2/results";
import { ApiError } from "@/lib/v2/http";
import { useProviderMe } from "@/hooks/queries/use-provider-me";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { describeApiError } from "@/lib/utils/shared/api-error";
import {
  mapOutcomesToMetricCategories,
  triageTagOf,
} from "@/lib/utils/provider/result-metrics";
import type { CareStatus, ResultDetail } from "@/lib/v2/types";

const V2 = QUERY_KEYS.v2;

export interface MetricItem {
  name: string;
  description: string;
  value: string;
  color: string;
  severity?: "mild" | "mod" | "sev";
}

export interface MetricCategory {
  name: string;
  description: string;
  score: string;
  color: string;
  items: MetricItem[];
}

/**
 * One result: `GET /results/{id}` (opening it records the view), Active /
 * Inactive, care (TREATING), and comments. A 404 means the result isn't
 * available to this provider (not attached, or not yet accepted) — shown as
 * such, never as a crash.
 */
export function useProviderPatientDetails() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.resultId as string;
  const queryClient = useQueryClient();
  const { data: me } = useProviderMe();

  const detailQuery = useQuery({
    queryKey: V2.result(resultId),
    queryFn: () => resultsApi.get(resultId),
    enabled: !!resultId,
    staleTime: 60 * 1000,
    retry: (count, error) =>
      !(error instanceof ApiError && error.status < 500) && count < 2,
  });
  const detail = detailQuery.data ?? null;
  const notAvailable =
    detailQuery.error instanceof ApiError &&
    (detailQuery.error.code === "NOT_FOUND" ||
      detailQuery.error.code === "FORBIDDEN");

  const commentsQuery = useQuery({
    queryKey: V2.resultComments(resultId),
    queryFn: () => resultsApi.comments(resultId),
    enabled: !!detail,
    staleTime: 30 * 1000,
  });

  const onDetail = (updated: ResultDetail) => {
    queryClient.setQueryData(V2.result(resultId), updated);
    void queryClient.invalidateQueries({ queryKey: V2.myCampuses });
    void queryClient.invalidateQueries({ queryKey: V2.urgentResults });
  };
  const onError = (error: unknown) =>
    toast.error(describeApiError(error).message);

  const careMutation = useMutation({
    mutationFn: (status: CareStatus) =>
      resultsApi.setCare(resultId, { status }),
    onSuccess: (updated) => {
      onDetail(updated);
      toast.success("You're now treating this student.");
    },
    onError,
  });

  const activeMutation = useMutation({
    mutationFn: (active: boolean) => resultsApi.setActive(resultId, active),
    onSuccess: onDetail,
    onError,
  });

  const commentMutation = useMutation({
    mutationFn: (body: string) => resultsApi.addComment(resultId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: V2.resultComments(resultId) }),
  });

  const metrics = useMemo<MetricCategory[]>(
    () => (detail ? mapOutcomesToMetricCategories(detail.outcomes) : []),
    [detail],
  );

  // A provider's id is their account id.
  const myId = me?.id;
  const myCare = detail?.care.find((c) => c.providerId === myId) ?? null;
  const otherCare = detail?.care.filter((c) => c.providerId !== myId) ?? [];

  const startTreating = useCallback(() => {
    if (myCare?.status === "TREATING") return;
    careMutation.mutate("TREATING");
  }, [careMutation, myCare?.status]);

  return {
    router,
    resultId,
    detail,
    tag: detail ? triageTagOf(detail) : null,
    isLoading: detailQuery.isLoading,
    notAvailable,
    loadError: detailQuery.error && !notAvailable ? detailQuery.error : null,
    metrics,
    isTreating: myCare?.status === "TREATING",
    otherCare,
    startTreating,
    isUpdatingCare: careMutation.isPending,
    setActive: activeMutation.mutate,
    isUpdatingActive: activeMutation.isPending,
    comments: commentsQuery.data ?? [],
    isCommentsLoading: commentsQuery.isLoading,
    addComment: commentMutation.mutateAsync,
    isAddingComment: commentMutation.isPending,
    myAccountId: myId,
  };
}
