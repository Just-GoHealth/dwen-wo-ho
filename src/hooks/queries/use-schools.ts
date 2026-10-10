"use client";
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { schoolsService } from "@/services/curator/schools";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";

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

const useSchoolStudents = (schoolId: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: [QUERY_KEYS.schools, "students", schoolId],
    queryFn: () => schoolsService.getSchoolStudents(schoolId),
    enabled: (options?.enabled ?? true) && !!schoolId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create school");
    },
  });

  const disableSchoolMutation = useMutation({
    mutationFn: schoolsService.disableSchool,
    onSuccess: (data, schoolId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.schools] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.schools, String(schoolId)],
      });
      toast.success("School disabled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to disable school");
    },
  });

  const updateSchoolMutation = useMutation({
    mutationFn: schoolsService.updateSchool,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.schools] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.schools, String(variables.id)],
      });
      toast.success("School updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update school");
    },
  });

  return {
    useSchools,
    useSchoolsWithRefetch,
    useSchool,
    useSchoolStudents,
    createSchool: createSchoolMutation.mutateAsync,
    disableSchool: disableSchoolMutation.mutateAsync,
    updateSchool: updateSchoolMutation.mutateAsync,
    isCreating: createSchoolMutation.isPending,
    isDisabling: disableSchoolMutation.isPending,
    isUpdating: updateSchoolMutation.isPending,
    invalidateSchool,
  };
}
