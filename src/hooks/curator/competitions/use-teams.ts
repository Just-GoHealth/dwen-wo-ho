"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { nsmqCurator, type TeamPatch } from "@/lib/v2/curator/nsmq";
import type { UUID } from "@/lib/v2/curator/types";
import { toastCuratorError } from "@/lib/v2/curator/errors";

/**
 * There's no single-team GET in v2: a team is read from its version's team
 * list, which shares the cache entry the version page already loaded.
 */
const useTeam = (
  versionCode: string,
  teamId: UUID,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: [QUERY_KEYS.competitionTeam, versionCode],
    queryFn: () => nsmqCurator.teams(versionCode),
    select: (teams) => teams.find((t) => t.id === teamId) ?? null,
    enabled: (options?.enabled ?? true) && !!versionCode && !!teamId,
    staleTime: 2 * 60 * 1000,
  });

export default function useTeamsQuery() {
  const queryClient = useQueryClient();

  const updateTeamMutation = useMutation({
    mutationFn: ({ teamId, data }: { teamId: UUID; data: TeamPatch }) =>
      nsmqCurator.updateTeam(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.competitionTeam] });
      toast.success("Team updated");
    },
    // 422 CODES_EXCEED_CAPACITY when the new seat capacity is below the live codes.
    onError: (error) => {
      toastCuratorError(error, { fallback: "Failed to update team" });
    },
  });

  return {
    useTeam,
    updateTeam: updateTeamMutation.mutateAsync,
    isUpdatingTeam: updateTeamMutation.isPending,
  };
}
