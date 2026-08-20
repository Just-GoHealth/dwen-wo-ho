"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { versionsService } from "@/services/curator/competitions/versions";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { parseApiError } from "@/lib/utils/shared/api-error";
import type {
  RegisterTeamRequest,
  SetVersionPeriodRequest,
  TagSchoolsIntoVersionRequest,
  ImportFixturesRequest,
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
      toast.error(parseApiError(error).message);
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
      const { code } = parseApiError(error);
      // Recovery for this specific case lives in JoinCompetitionPill, which
      // looks the existing team up instead of leaving the curator stuck —
      // skip the toast there so it doesn't read as a real failure.
      if (code === "TEAM_ALREADY_EXISTS") return;
      toast.error(parseApiError(error).message);
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
      toast.error(parseApiError(error).message);
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
      toast.error(parseApiError(error).message);
    },
  });

  const importFixturesMutation = useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: string;
      data: ImportFixturesRequest;
    }) => versionsService.importFixtures(code, data),
    onSuccess: (result, { code }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.competitionTeam, code],
      });
      if (result.skipped.length > 0) {
        toast.warning(
          `Imported ${result.imported}, skipped ${result.skipped.length} (no team for that campus)`,
        );
      } else {
        toast.success(`Imported ${result.imported} fixture${result.imported === 1 ? "" : "s"}`);
      }
    },
    onError: (error: Error) => {
      toast.error(parseApiError(error).message);
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
