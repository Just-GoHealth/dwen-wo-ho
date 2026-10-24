"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import {
  nsmqCurator,
  type FixtureOutcome,
  type FixturePatch,
  type FixtureRequest,
  type FixtureView,
} from "@/lib/v2/curator/nsmq";
import type { UUID } from "@/lib/v2/curator/types";
import { toastCuratorError } from "@/lib/v2/curator/errors";

/** Every school is in Ghana; fixtures default to its zone. */
export const DEFAULT_FIXTURE_TIMEZONE = "Africa/Accra";

/** "Mon 1 Sep · 3pm", in the fixture's own timezone (replaces v1's whenLabel). */
export function formatKickoff(
  fixture: Pick<FixtureView, "kickoffAt" | "timezone">,
) {
  const date = new Date(fixture.kickoffAt);
  const timeZone = fixture.timezone || DEFAULT_FIXTURE_TIMEZONE;
  const day = date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone,
  });
  const time = date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    })
    .replace(":00", "")
    .replace(" ", "")
    .toLowerCase();
  return `${day} · ${time}`;
}

/** The team's next live fixture: the earliest scheduled one still ahead, else the latest. */
export function nextFixture(fixtures: FixtureView[]): FixtureView | null {
  const live = fixtures.filter((f) => f.status !== "CANCELLED");
  if (live.length === 0) return null;
  const byKickoff = [...live].sort(
    (a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime(),
  );
  const now = Date.now();
  return (
    byKickoff.find(
      (f) => f.status === "SCHEDULED" && new Date(f.kickoffAt).getTime() >= now,
    ) ?? byKickoff[byKickoff.length - 1]
  );
}

const fixturesKey = (teamId: UUID) => [QUERY_KEYS.competitionFixtures, teamId];

const useFixtures = (teamId: UUID, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: fixturesKey(teamId),
    queryFn: () => nsmqCurator.fixtures(teamId),
    enabled: (options?.enabled ?? true) && !!teamId,
    staleTime: 2 * 60 * 1000,
  });

export default function useFixturesQuery() {
  const queryClient = useQueryClient();

  const invalidateTeamFixtures = (teamId: UUID) => {
    queryClient.invalidateQueries({ queryKey: fixturesKey(teamId) });
    // Adding/moving a fixture re-dates the team's unredeemed access codes.
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.competitionAccessCodes, teamId],
    });
    // Team status and nextKickoff follow the fixtures.
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.competitionTeam] });
  };

  const onError =
    (fallback: string) =>
    (error: Error, { teamId }: { teamId: UUID }) =>
      toastCuratorError(error, {
        fallback,
        onStale: () => invalidateTeamFixtures(teamId),
      });

  const addFixtureMutation = useMutation({
    mutationFn: ({ teamId, data }: { teamId: UUID; data: FixtureRequest }) =>
      nsmqCurator.createFixture(teamId, data),
    onSuccess: (_, { teamId }) => {
      invalidateTeamFixtures(teamId);
      toast.success("Fixture added");
    },
    onError: onError("Failed to add fixture"),
  });

  const updateFixtureMutation = useMutation({
    mutationFn: ({
      fixtureId,
      data,
    }: {
      fixtureId: UUID;
      teamId: UUID;
      data: FixturePatch;
    }) => nsmqCurator.updateFixture(fixtureId, data),
    onSuccess: (_, { teamId }) => {
      invalidateTeamFixtures(teamId);
      toast.success("Fixture updated");
    },
    // 409 STALE: reload the fixtures, then tell the curator.
    onError: onError("Failed to update fixture"),
  });

  const deleteFixtureMutation = useMutation({
    mutationFn: ({ fixtureId }: { fixtureId: UUID; teamId: UUID }) =>
      nsmqCurator.deleteFixture(fixtureId),
    onSuccess: (_, { teamId }) => {
      invalidateTeamFixtures(teamId);
      toast.success("Fixture deleted");
    },
    onError: onError("Failed to delete fixture"),
  });

  const cancelFixtureMutation = useMutation({
    mutationFn: ({ fixtureId }: { fixtureId: UUID; teamId: UUID }) =>
      nsmqCurator.cancelFixture(fixtureId),
    onSuccess: (_, { teamId }) => {
      invalidateTeamFixtures(teamId);
      toast.success("Fixture cancelled");
    },
    onError: onError("Failed to cancel fixture"),
  });

  const recordOutcomeMutation = useMutation({
    mutationFn: ({
      fixtureId,
      outcome,
    }: {
      fixtureId: UUID;
      teamId: UUID;
      outcome: FixtureOutcome;
    }) => nsmqCurator.setOutcome(fixtureId, outcome),
    onSuccess: (_, { teamId }) => {
      invalidateTeamFixtures(teamId);
      toast.success("Outcome recorded");
    },
    onError: onError("Failed to record outcome"),
  });

  return {
    useFixtures,
    addFixture: addFixtureMutation.mutateAsync,
    isAddingFixture: addFixtureMutation.isPending,
    updateFixture: updateFixtureMutation.mutateAsync,
    isUpdatingFixture: updateFixtureMutation.isPending,
    deleteFixture: deleteFixtureMutation.mutateAsync,
    isDeletingFixture: deleteFixtureMutation.isPending,
    cancelFixture: cancelFixtureMutation.mutateAsync,
    isCancellingFixture: cancelFixtureMutation.isPending,
    recordOutcome: recordOutcomeMutation.mutateAsync,
    isRecordingOutcome: recordOutcomeMutation.isPending,
  };
}
