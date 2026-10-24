"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { providerApi } from "@/lib/v2/provider";
import { authApi } from "@/lib/v2/auth";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { patchProviderProfile } from "@/lib/utils/provider/profile-patch";
import type { ProviderPatchRequest, ProviderProfile } from "@/lib/v2/types";

const V2 = QUERY_KEYS.v2;

/** `GET /providers/me` — profile, `status`, `next`, `missing`, `version`. */
export const useProviderMe = (options?: {
  enabled?: boolean;
  refetchInterval?: number | false;
}) =>
  useQuery({
    queryKey: V2.providerMe,
    queryFn: providerApi.me,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    ...options,
  });

/** `GET /role-categories` — public, alphabetical, for the specialty picker. */
export const useRoleCategories = () =>
  useQuery({
    queryKey: V2.roleCategories,
    queryFn: authApi.roleCategories,
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    select: (categories) => categories.filter((c) => !c.dormant),
  });

/**
 * `PATCH /providers/me` with the cached profile's `version`. On 409 STALE the
 * cache is replaced by the reloaded profile and the user is told why their
 * edit didn't land. Resolves with the outcome so callers can re-route by
 * `next` (filling the last required field submits the application).
 */
export const usePatchProviderMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (changes: Omit<ProviderPatchRequest, "version">) => {
      const current =
        queryClient.getQueryData<ProviderProfile>(V2.providerMe) ??
        (await providerApi.me());
      return patchProviderProfile(current, changes, {
        patch: providerApi.patchMe,
        reload: providerApi.me,
      });
    },
    onSuccess: (outcome) => {
      queryClient.setQueryData(V2.providerMe, outcome.profile);
      if (outcome.kind === "stale") toast.error(outcome.message);
    },
  });
};

export const useUploadProviderPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: Blob) => providerApi.uploadPhoto(file),
    onSuccess: (profile) => {
      queryClient.setQueryData(V2.providerMe, profile);
    },
  });
};

export const useResubmitApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: providerApi.resubmit,
    onSuccess: (profile) => {
      queryClient.setQueryData(V2.providerMe, profile);
    },
  });
};
