"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fixturesService } from "@/services/curator/competitions/fixtures";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import type {
  AddFixtureRequest,
  RecordFixtureOutcomeRequest,
} from "@/lib/types/api/competitions";

const useFixtures = (
  teamId: string | number,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: [QUERY_KEYS.competitionFixtures, String(teamId)],
    queryFn: () => fixturesService.getFixtures(teamId),
    enabled: (options?.enabled ?? true) && !!teamId,
    staleTime: 2 * 60 * 1000,
  });

export default function useFixturesQuery() {
  const queryClient = useQueryClient();

  const invalidateTeamFixtures = (teamId: string | number) => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.competitionFixtures, String(teamId)],
    });
    // Adding/moving a fixture re-dates the team's unredeemed access codes.
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.competitionAccessCodes, String(teamId)],
    });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.competitionTeam] });
  };

  const addFixtureMutation = useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: string | number;
      data: AddFixtureRequest;
    }) => fixturesService.addFixture(teamId, data),
    onSuccess: (_, { teamId }) => {
      invalidateTeamFixtures(teamId);
      toast.success("Fixture added");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add fixture");
    },
  });

  const updateFixtureMutation = useMutation({
    mutationFn: ({
      fixtureId,
      data,
    }: {
      fixtureId: string | number;
      teamId: string | number;
      data: AddFixtureRequest;
    }) => fixturesService.updateFixture(fixtureId, data),
    onSuccess: (_, { teamId }) => {
      invalidateTeamFixtures(teamId);
      toast.success("Fixture updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update fixture");
    },
  });

  const deleteFixtureMutation = useMutation({
    mutationFn: ({
      fixtureId,
    }: {
      fixtureId: string | number;
      teamId: string | number;
    }) => fixturesService.deleteFixture(fixtureId),
    onSuccess: (_, { teamId }) => {
      invalidateTeamFixtures(teamId);
      toast.success("Fixture deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete fixture");
    },
  });

  const recordOutcomeMutation = useMutation({
    mutationFn: ({
      fixtureId,
      data,
    }: {
      fixtureId: string | number;
      teamId: string | number;
      data: RecordFixtureOutcomeRequest;
    }) => fixturesService.recordOutcome(fixtureId, data),
    onSuccess: (_, { teamId }) => {
      invalidateTeamFixtures(teamId);
      toast.success("Outcome recorded");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to record outcome");
    },
  });

  return {
    useFixtures,
    addFixture: addFixtureMutation.mutateAsync,
    isAddingFixture: addFixtureMutation.isPending,
    updateFixture: updateFixtureMutation.mutateAsync,
    isUpdatingFixture: updateFixtureMutation.isPending,
    deleteFixture: deleteFixtureMutation.mutateAsync,
    isDeletingFixture: deleteFixtureMutation.isPending,
    recordOutcome: recordOutcomeMutation.mutateAsync,
    isRecordingOutcome: recordOutcomeMutation.isPending,
  };
}
