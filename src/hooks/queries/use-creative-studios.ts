"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { creativeStudiosService } from "@/services/curator/creative-studios";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { toastCuratorError } from "@/lib/v2/curator/errors";
import type {
  CreateCampusInput,
  CreateProgrammeInput,
  CreateStudioProviderInput,
  CreateTagInput,
} from "@/lib/types/api/creative-studios";

export default function useCreativeStudiosQuery() {
  const queryClient = useQueryClient();

  const invalidateCreativeStudiosSummary = () => {
    void queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.curatorSummary],
    });
  };

  // Field problems (NAME_TAKEN on fullName/nicknames/title, VALIDATION) are shown
  // beside the fields by the flow; the toast carries the server's `detail`.
  const createCampusMutation = useMutation({
    mutationFn: (input: CreateCampusInput) =>
      creativeStudiosService.createCampus(input),
    onSuccess: () => {
      invalidateCreativeStudiosSummary();
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.campuses] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.schools] });
      toast.success("Campus created successfully");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to create campus" }),
  });

  const createProgrammeMutation = useMutation({
    mutationFn: (input: CreateProgrammeInput) =>
      creativeStudiosService.createProgramme(input),
    onSuccess: () => {
      invalidateCreativeStudiosSummary();
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.programmes] });
      toast.success("Programme created successfully");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to create programme" }),
  });

  const createTagMutation = useMutation({
    mutationFn: (input: CreateTagInput) =>
      creativeStudiosService.createTag(input),
    onSuccess: () => {
      invalidateCreativeStudiosSummary();
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tags] });
      toast.success("Tag created successfully");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to create tag" }),
  });

  const createProviderMutation = useMutation({
    mutationFn: (input: CreateStudioProviderInput) =>
      creativeStudiosService.createProvider(input),
    onSuccess: () => {
      invalidateCreativeStudiosSummary();
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.providers] });
      toast.success("Provider created successfully");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to create provider" }),
  });

  return {
    createCampus: createCampusMutation.mutateAsync,
    createProgramme: createProgrammeMutation.mutateAsync,
    createTag: createTagMutation.mutateAsync,
    createProvider: createProviderMutation.mutateAsync,
    isCreatingCampus: createCampusMutation.isPending,
    isCreatingProgramme: createProgrammeMutation.isPending,
    isCreatingTag: createTagMutation.isPending,
    isCreatingProvider: createProviderMutation.isPending,
  };
}
