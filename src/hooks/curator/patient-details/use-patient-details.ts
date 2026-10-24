"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { http } from "@/lib/v2/http";
import { resultsCurator } from "@/lib/v2/curator/results";
import { fieldMessage, toastCuratorError } from "@/lib/v2/curator/errors";
import type { ResultDetail } from "@/lib/v2/curator/types";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { buildOutcomeMetrics } from "@/lib/utils/curator/patient-dashboard/outcome-metrics";
import type {
  Benchmarks,
  CuratorPatientDetailsState,
} from "@/lib/types/components/curator/patient-dashboard";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Curator-only keys: the provider screens cache results under their own.
const resultKey = (id: string) => ["curator-result", id] as const;
const commentsKey = (id: string) => ["curator-result", id, "comments"] as const;

export function useCuratorPatientDetails(): CuratorPatientDetailsState {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const schoolId = params.schoolId as string;
  // This route segment is the result id (a UUID in v2). Anything else would
  // only come back as a 400, so it isn't sent.
  const rawResultId = params.patientId as string;
  const resultId = UUID_PATTERN.test(rawResultId) ? rawResultId : "";

  // Opening the result is recorded server-side (last viewer, Seen).
  const detailQuery = useQuery({
    queryKey: resultKey(resultId),
    queryFn: () => resultsCurator.detail(resultId),
    enabled: !!resultId,
    staleTime: 60 * 1000,
  });
  const detail = detailQuery.data ?? null;

  const commentsQuery = useQuery({
    queryKey: commentsKey(resultId),
    queryFn: () => resultsCurator.comments(resultId),
    enabled: !!resultId,
  });

  // Section averages for the campus, its school type, and everywhere.
  const campusId = detail?.campusId;
  const benchmarksQuery = useQuery({
    queryKey: ["curator-benchmarks", campusId],
    queryFn: () => http.get<Benchmarks>("/benchmarks", { query: { campusId } }),
    enabled: !!campusId,
    staleTime: 10 * 60 * 1000,
  });

  const onDetail = (next: ResultDetail) => {
    queryClient.setQueryData(resultKey(resultId), next);
    void queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.schoolPatientsOverview(schoolId),
    });
  };

  const activeMutation = useMutation({
    mutationFn: (active: boolean) => resultsCurator.setActive(resultId, active),
    onSuccess: (next) => {
      onDetail(next);
      toast.success(next.result.active ? "Marked active" : "Marked inactive");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to update the result" }),
  });

  const acceptMutation = useMutation({
    mutationFn: () => resultsCurator.accept(resultId),
    onSuccess: (next) => {
      onDetail(next);
      toast.success("Result accepted; the campus's providers can see it now");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to accept the result" }),
  });

  const commentMutation = useMutation({
    mutationFn: (body: string) => resultsCurator.addComment(resultId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: commentsKey(resultId) }),
    onError: (error) =>
      // `body` problems show beside the field; this is the summary.
      toastCuratorError(error, { fallback: "Failed to post the comment" }),
  });

  return {
    router,
    detail,
    isLoading: !!resultId && detailQuery.isLoading,
    isError: !resultId || detailQuery.isError,
    metrics: detail ? buildOutcomeMetrics(detail.outcomes) : [],
    benchmarks: benchmarksQuery.data ?? null,
    comments: commentsQuery.data ?? [],
    isCommentsLoading: commentsQuery.isLoading,
    addComment: commentMutation.mutateAsync,
    isAddingComment: commentMutation.isPending,
    commentError: fieldMessage(commentMutation.error, "body"),
    toggleActive: () => {
      if (detail) activeMutation.mutate(!detail.result.active);
    },
    isTogglingActive: activeMutation.isPending,
    accept: () => acceptMutation.mutate(),
    isAccepting: acceptMutation.isPending,
  };
}
