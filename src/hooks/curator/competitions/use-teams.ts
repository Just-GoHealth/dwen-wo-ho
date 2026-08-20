"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { teamsService } from "@/services/curator/competitions/teams";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import type { Team } from "@/lib/types/api/competitions";

const useTeam = (teamId: string | number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: [QUERY_KEYS.competitionTeam, "single", String(teamId)],
    queryFn: () => teamsService.getTeam(teamId),
    enabled: (options?.enabled ?? true) && !!teamId,
    staleTime: 2 * 60 * 1000,
  });

export default function useTeamsQuery() {
  const queryClient = useQueryClient();

  const updateTeamMutation = useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: string | number;
      data: Partial<Team>;
    }) => teamsService.updateTeam(teamId, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.competitionTeam, "single", String(teamId)],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.competitionTeam] });
      toast.success("Team updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update team");
    },
  });

  return {
    useTeam,
    updateTeam: updateTeamMutation.mutateAsync,
    isUpdatingTeam: updateTeamMutation.isPending,
  };
}
