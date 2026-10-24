"use client";
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { schoolsService } from "@/services/curator/schools";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { toastCuratorError } from "@/lib/v2/curator/errors";

// ─── Query Hooks ─────────────────────────────────────────────────────────────
// Hoisted to module scope; they close over no component state, only imported
// services and constants.
const useSchools = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: [QUERY_KEYS.schools],
    queryFn: () => schoolsService.getSchools(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

const useSchoolsWithRefetch = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: [QUERY_KEYS.schools],
    queryFn: () => schoolsService.getSchools(),
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

const useSchool = (schoolId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.schools, schoolId],
    queryFn: () => schoolsService.getSchool(schoolId),
    enabled: !!schoolId,
  });

export default function useSchoolsQuery() {
  const queryClient = useQueryClient();

  const invalidateSchool = useCallback(
    async (schoolId: string) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.schools] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.schools, schoolId],
      });
    },
    [queryClient],
  );

  const createSchoolMutation = useMutation({
    mutationFn: schoolsService.createSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.schools] });
      toast.success("School created successfully");
    },
    // Field problems (NAME_TAKEN on fullName/nicknames) are shown beside the
    // fields by the form; this is the summary.
    onError: (error: Error) =>
      toastCuratorError(error, { fallback: "Failed to create school" }),
  });

  // v1 "disable" is v2 archive: the campus leaves pickers and lists, its
  // results and access stay, and it can be restored.
  const disableSchoolMutation = useMutation({
    mutationFn: schoolsService.archiveSchool,
    onSuccess: (data, schoolId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.schools] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.schools, String(schoolId)],
      });
      toast.success("School archived");
    },
  });

  const restoreSchoolMutation = useMutation({
    mutationFn: schoolsService.restoreSchool,
    onSuccess: (data, schoolId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.schools] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.schools, String(schoolId)],
      });
      toast.success("School restored");
    },
    onError: (error: Error) =>
      toastCuratorError(error, { fallback: "Failed to restore school" }),
  });

  const updateSchoolMutation = useMutation({
    mutationFn: schoolsService.updateSchool,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.schools] });
      queryClient.setQueryData([QUERY_KEYS.schools, variables.id], data);
      toast.success("School updated successfully");
    },
    onError: (error: Error, variables) =>
      toastCuratorError(error, {
        fallback: "Failed to update school",
        // 409 STALE: reload the campus so the form re-seeds at the new version.
        onStale: () =>
          void queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.schools, variables.id],
          }),
      }),
  });

  return {
    useSchools,
    useSchoolsWithRefetch,
    useSchool,
    createSchool: createSchoolMutation.mutateAsync,
    disableSchool: disableSchoolMutation.mutateAsync,
    restoreSchool: restoreSchoolMutation.mutateAsync,
    updateSchool: updateSchoolMutation.mutateAsync,
    updateSchoolError: updateSchoolMutation.error,
    resetUpdateSchool: updateSchoolMutation.reset,
    isCreating: createSchoolMutation.isPending,
    isDisabling: disableSchoolMutation.isPending,
    isUpdating: updateSchoolMutation.isPending,
    invalidateSchool,
  };
}
