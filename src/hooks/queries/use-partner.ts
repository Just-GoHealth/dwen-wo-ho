"use client";
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { partnersService } from "@/services/curator/partners";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { toastCuratorError } from "@/lib/v2/curator/errors";

// Partners are v2 hosts. Creating a host lives in Studios; disabling one has
// no v2 endpoint (see backend-gaps/curator-v2-gaps.md).

// Hoisted query hooks — they close over no component state.
const usePartnersList = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: [QUERY_KEYS.partners],
    queryFn: partnersService.getPartners,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

const usePartner = (partnerId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.partners, partnerId],
    queryFn: () => partnersService.getPartner(partnerId),
    enabled: !!partnerId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

const usePartnerFullDetails = (
  partnerId: string,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: [QUERY_KEYS.partners, partnerId, "details"],
    queryFn: () => partnersService.getPartnerWithDetails(partnerId),
    enabled: (options?.enabled ?? true) && !!partnerId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export default function usePartnerQuery() {
  const queryClient = useQueryClient();

  const invalidatePartners = useCallback(
    async (partnerId?: string) => {
      await queryClient.invalidateQueries({
        queryKey: partnerId
          ? [QUERY_KEYS.partners, partnerId]
          : [QUERY_KEYS.partners],
      });
    },
    [queryClient],
  );

  const addSchoolMutation = useMutation({
    mutationFn: ({
      partnerId,
      schoolId,
    }: {
      partnerId: string;
      schoolId: string;
    }) => partnersService.addSchoolToPartner(partnerId, schoolId),
    onSuccess: (_, { partnerId }) => {
      void invalidatePartners(partnerId);
      toast.success("School added successfully");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to add school" }),
  });

  const removeSchoolMutation = useMutation({
    mutationFn: ({
      partnerId,
      schoolId,
    }: {
      partnerId: string;
      schoolId: string;
    }) => partnersService.removeSchoolFromPartner(partnerId, schoolId),
    onSuccess: (_, { partnerId }) => {
      void invalidatePartners(partnerId);
      toast.success("School removed successfully");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to remove school" }),
  });

  const addProviderMutation = useMutation({
    mutationFn: ({
      partnerId,
      providerId,
    }: {
      partnerId: string;
      providerId: string;
    }) => partnersService.addProviderToPartner(partnerId, providerId),
    onSuccess: (_, { partnerId }) => {
      void invalidatePartners(partnerId);
      toast.success("Provider added successfully");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to add provider" }),
  });

  const removeProviderMutation = useMutation({
    mutationFn: ({
      partnerId,
      providerId,
    }: {
      partnerId: string;
      providerId: string;
    }) => partnersService.removeProviderFromPartner(partnerId, providerId),
    onSuccess: (_, { partnerId }) => {
      void invalidatePartners(partnerId);
      toast.success("Provider removed successfully");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to remove provider" }),
  });

  return {
    usePartnersList,
    usePartner,
    addSchool: addSchoolMutation.mutateAsync,
    isAddingSchool: addSchoolMutation.isPending,
    removeSchool: removeSchoolMutation.mutateAsync,
    isRemovingSchool: removeSchoolMutation.isPending,
    addProvider: addProviderMutation.mutateAsync,
    isAddingProvider: addProviderMutation.isPending,
    removeProvider: removeProviderMutation.mutateAsync,
    isRemovingProvider: removeProviderMutation.isPending,
    usePartnerFullDetails,
    invalidatePartners,
  };
}
