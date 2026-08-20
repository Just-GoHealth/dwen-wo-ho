"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { versionsService } from "@/services/curator/competitions/versions";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import type {
  RegisterTeamRequest,
  SetVersionPeriodRequest,
  TagSchoolsIntoVersionRequest,
} from "@/lib/types/api/competitions";

const useVersionTeams = (code: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: [QUERY_KEYS.competitionTeam, code],
    queryFn: () => versionsService.getTeams(code),
    enabled: (options?.enabled ?? true) && !!code,
    staleTime: 2 * 60 * 1000,
  });

export default function useVersionsQuery() {
  const queryClient = useQueryClient();

  const setPeriodMutation = useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: string;
      data: SetVersionPeriodRequest;
    }) => versionsService.setPeriod(code, data),
    onSuccess: () => {
      toast.success("Competition season updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to set the competition season");
    },
  });

  const registerTeamMutation = useMutation({
    mutationFn: ({ code, data }: { code: string; data: RegisterTeamRequest }) =>
      versionsService.registerTeam(code, data),
    onSuccess: (_, { code }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.competitionTeam, code],
      });
      toast.success("Team registered");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register team");
    },
  });

  const tagSchoolsMutation = useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: string;
      data: TagSchoolsIntoVersionRequest;
    }) => versionsService.tagSchools(code, data),
    onSuccess: (_, { code }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.competitionTeam, code],
      });
      toast.success("Schools tagged into the competition");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to tag schools");
    },
  });

  const untagSchoolMutation = useMutation({
    mutationFn: ({
      code,
      campusId,
    }: {
      code: string;
      campusId: string | number;
    }) => versionsService.untagSchool(code, campusId),
    onSuccess: (_, { code }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.competitionTeam, code],
      });
      toast.success("School removed from the competition");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove school");
    },
  });

  const importFixturesMutation = useMutation({
    mutationFn: ({ code, payload }: { code: string; payload: unknown }) =>
      versionsService.importFixtures(code, payload),
    onSuccess: (_, { code }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.competitionTeam, code],
      });
      toast.success("Fixtures imported");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to import fixtures");
    },
  });

  return {
    useVersionTeams,
    setPeriod: setPeriodMutation.mutateAsync,
    isSettingPeriod: setPeriodMutation.isPending,
    registerTeam: registerTeamMutation.mutateAsync,
    isRegisteringTeam: registerTeamMutation.isPending,
    tagSchools: tagSchoolsMutation.mutateAsync,
    isTaggingSchools: tagSchoolsMutation.isPending,
    untagSchool: untagSchoolMutation.mutateAsync,
    isUntaggingSchool: untagSchoolMutation.isPending,
    importFixtures: importFixturesMutation.mutateAsync,
    isImportingFixtures: importFixturesMutation.isPending,
  };
}
