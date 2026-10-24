"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { joinRequestsCurator } from "@/lib/v2/curator/providers";
import { hasCode, toastCuratorError } from "@/lib/v2/curator/errors";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";

export const JUST_IN_QUERY_KEY = ["curator-just-in"] as const;

/**
 * Just In (11.2): approved providers asking to join a campus or host. Provider
 * applications are decided from the provider cards. The `just-in` stream
 * event should invalidate JUST_IN_QUERY_KEY.
 */
export function useJustInQueue() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: JUST_IN_QUERY_KEY,
    queryFn: async () => {
      const page = await joinRequestsCurator.list({
        status: "PENDING",
        size: 100,
      });
      return page.items.filter((r) => r.kind !== "PROVIDER_APPLICATION");
    },
    staleTime: 60 * 1000,
  });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: JUST_IN_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.providers] });
  };

  const decide = useMutation({
    mutationFn: ({ id, approve }: { id: string; approve: boolean }) =>
      approve
        ? joinRequestsCurator.approve(id)
        : joinRequestsCurator.decline(id),
    onSuccess: (_, { approve }) => {
      refresh();
      toast.success(approve ? "Request approved" : "Request declined");
    },
    onError: (error) => {
      // REQUEST_DECIDED: already handled elsewhere; reload the queue.
      if (hasCode(error, "REQUEST_DECIDED")) refresh();
      toastCuratorError(error, { fallback: "Failed to update the request" });
    },
  });

  return {
    requests: query.data ?? [],
    isLoading: query.isLoading,
    decide: decide.mutate,
    decidingId: decide.isPending ? decide.variables?.id : undefined,
  };
}
