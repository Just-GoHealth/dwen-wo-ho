"use client";
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  curatorProvidersService,
  fromProviderProfile,
  fromProviderSummary,
} from "@/services/curator/providers";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { hasCode, toastCuratorError } from "@/lib/v2/curator/errors";

// Provider app (activity log, schools summary): still v1, owned by the
// provider migration.
// Single provider query (by UUID) — hoisted; closes over no component state.
const useProvider = (providerId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.providers, providerId],
    queryFn: async () =>
      fromProviderProfile(
        await curatorProvidersService.getProvider(providerId),
      ),
    enabled: !!providerId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useProvidersQuery = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();

  const {
    data: providers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.providers],
    queryFn: async () =>
      (await curatorProvidersService.getProviders()).map(fromProviderSummary),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

  const invalidateProvider = useCallback(
    async (providerId: string) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.providers] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.providers, providerId],
      });
    },
    [queryClient],
  );

  // A request someone else already decided: reload so the card shows the outcome.
  const onDecisionError = (error: unknown, providerId: string) => {
    if (hasCode(error, "REQUEST_DECIDED")) void invalidateProvider(providerId);
    toastCuratorError(error, { fallback: "Failed to update the application" });
  };

  // Approve: approves the provider's pending application in Just In.
  const approveProviderMutation = useMutation({
    mutationFn: curatorProvidersService.approveProvider,
    onSuccess: (_, providerId) => {
      void invalidateProvider(providerId);
      toast.success("Provider approved successfully");
    },
    onError: onDecisionError,
  });

  // Reject: declines the pending application (they may resubmit).
  const rejectProviderMutation = useMutation({
    mutationFn: curatorProvidersService.rejectProvider,
    onSuccess: (_, providerId) => {
      void invalidateProvider(providerId);
      toast.success("Provider rejected successfully");
    },
    onError: onDecisionError,
  });

  const addSchoolMutation = useMutation({
    mutationFn: ({
      providerId,
      schoolId,
    }: {
      providerId: string;
      schoolId: string;
    }) => curatorProvidersService.addSchoolToProvider(providerId, schoolId),
    onSuccess: (_, { providerId }) => {
      void invalidateProvider(providerId);
      toast.success("School added to provider successfully");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to add school" }),
  });

  const removeSchoolMutation = useMutation({
    mutationFn: ({
      providerId,
      schoolId,
    }: {
      providerId: string;
      schoolId: string;
    }) =>
      curatorProvidersService.removeSchoolFromProvider(providerId, schoolId),
    onSuccess: (_, { providerId }) => {
      void invalidateProvider(providerId);
      toast.success("School removed from provider successfully");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to remove school" }),
  });

  return {
    // Queries
    providers,
    isLoading,
    isError,
    error,
    // Single provider query helper
    useProvider,
    // Mutations (keyed by provider id)
    approveProvider: (
      providerId: string,
      options?: { onSettled?: () => void },
    ) => {
      approveProviderMutation.mutate(providerId, {
        onSettled: options?.onSettled,
      });
    },
    rejectProvider: (
      providerId: string,
      options?: { onSettled?: () => void },
    ) => {
      rejectProviderMutation.mutate(providerId, {
        onSettled: options?.onSettled,
      });
    },
    isModerating:
      approveProviderMutation.isPending || rejectProviderMutation.isPending,
    addSchoolToProvider: addSchoolMutation.mutateAsync,
    isAddingSchool: addSchoolMutation.isPending,
    removeSchoolFromProvider: removeSchoolMutation.mutateAsync,
    isRemovingSchool: removeSchoolMutation.isPending,
    invalidateProvider,
  };
};
