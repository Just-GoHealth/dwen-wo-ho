"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { providerApi } from "@/lib/v2/provider";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { describeApiError } from "@/lib/utils/shared/api-error";
import type { JoinRequestBody } from "@/lib/v2/types";

const V2 = QUERY_KEYS.v2;

/** Friendly copy for the join-request codes the guide asks us to handle. */
export const JOIN_REQUEST_MESSAGES: Record<string, string> = {
  NOT_APPROVED:
    "You can ask to join campuses once your application is accepted.",
  ALREADY_REQUESTED:
    "You've already asked to join. We'll let you know when it's decided.",
  ALREADY_JOINED: "You're already part of this campus.",
  TARGET_UNAVAILABLE: "That campus isn't available to join any more.",
};

/**
 * Ask to join a campus (`POST /providers/me/join-requests`, 201) and list
 * past requests (`GET /providers/me/join-requests`, which also holds the
 * provider's own PROVIDER_APPLICATION rows with `target: null`).
 */
export function useJoinRequests(enabled = true) {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

  const requests = useQuery({
    queryKey: V2.joinRequests,
    queryFn: () => providerApi.joinRequests({ size: 50 }),
    enabled,
    staleTime: 60 * 1000,
  });

  const campuses = useQuery({
    queryKey: [...V2.campusDirectory, "search", query],
    queryFn: () => providerApi.campuses({ q: query || undefined, size: 20 }),
    enabled: enabled && query.trim().length > 1,
    staleTime: 5 * 60 * 1000,
  });

  const requestMutation = useMutation({
    mutationFn: (body: JoinRequestBody) => providerApi.requestJoin(body),
    onSuccess: () => {
      toast.success("Request sent. The JustGo team will review it.");
      void queryClient.invalidateQueries({ queryKey: V2.joinRequests });
    },
    onError: (error) => {
      const described = describeApiError(error);
      toast.error(JOIN_REQUEST_MESSAGES[described.code] ?? described.message);
      if (described.code === "ALREADY_JOINED") {
        void queryClient.invalidateQueries({ queryKey: V2.myCampuses });
      }
    },
  });

  return {
    query,
    setQuery,
    campusResults: campuses.data?.items ?? [],
    isSearching: campuses.isFetching,
    requests: (requests.data?.items ?? []).filter(
      (r) => r.kind !== "PROVIDER_APPLICATION",
    ),
    requestJoin: (campusId: string) =>
      requestMutation.mutate({ targetType: "CAMPUS", targetId: campusId }),
    pendingTargetId: requestMutation.isPending
      ? requestMutation.variables?.targetId
      : undefined,
  };
}
