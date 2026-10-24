"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import {
  nsmqCurator,
  type ImportRow,
  type TeamPatch,
  type TeamView,
} from "@/lib/v2/curator/nsmq";
import type { UUID } from "@/lib/v2/curator/types";
import { toastCuratorError } from "@/lib/v2/curator/errors";

const versionKey = (code: string) => [QUERY_KEYS.competitionVersion, code];
const teamsKey = (code: string) => [QUERY_KEYS.competitionTeam, code];

const useVersions = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: [QUERY_KEYS.competitionVersion, "all"],
    queryFn: nsmqCurator.versions,
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });

const useVersion = (code: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: versionKey(code),
    queryFn: () => nsmqCurator.version(code),
    enabled: (options?.enabled ?? true) && !!code,
    staleTime: 2 * 60 * 1000,
  });

const useVersionTeams = (code: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: teamsKey(code),
    queryFn: () => nsmqCurator.teams(code),
    enabled: (options?.enabled ?? true) && !!code,
    staleTime: 2 * 60 * 1000,
  });

/** Skipped rows from a tag call, as "reason (n)" for one toast. */
function describeSkipped(skipped: { reason: string }[]): string {
  const counts = new Map<string, number>();
  skipped.forEach((s) => counts.set(s.reason, (counts.get(s.reason) ?? 0) + 1));
  return Array.from(counts, ([reason, n]) => `${reason} (${n})`).join(", ");
}

export default function useVersionsQuery() {
  const queryClient = useQueryClient();
  const invalidateTeams = (code: string) =>
    queryClient.invalidateQueries({ queryKey: teamsKey(code) });

  const setPeriodMutation = useMutation({
    mutationFn: async ({
      code,
      startsAt,
      endsAt,
    }: {
      code: string;
      startsAt?: string;
      endsAt?: string;
    }) => {
      // PATCH needs the version the curator is editing; read it fresh so a
      // second tab's edit surfaces as 409 STALE rather than being overwritten.
      const current =
        queryClient.getQueryData<
          Awaited<ReturnType<typeof nsmqCurator.version>>
        >(versionKey(code)) ?? (await nsmqCurator.version(code));
      return nsmqCurator.updateVersion(code, {
        version: current.version,
        startsAt,
        endsAt,
      });
    },
    onSuccess: (version, { code }) => {
      queryClient.setQueryData(versionKey(code), version);
      toast.success("Competition season updated");
    },
    onError: (error, { code }) => {
      toastCuratorError(error, {
        fallback: "Failed to update the season",
        onStale: () =>
          queryClient.invalidateQueries({ queryKey: versionKey(code) }),
      });
    },
  });

  // v1 registered one team with its coordinator and seats in one call. v2
  // tags the campus in, then the team is edited; a campus that's already a
  // team comes back as skipped, so the existing team is looked up instead.
  const registerTeamMutation = useMutation({
    mutationFn: async ({
      code,
      campusId,
      patch,
    }: {
      code: string;
      campusId: UUID;
      patch?: TeamPatch;
    }): Promise<TeamView> => {
      const report = await nsmqCurator.tagTeams(code, [campusId]);
      let team: TeamView | undefined = report.added.find(
        (t) => t.campusId === campusId,
      );
      if (!team) {
        const teams = await nsmqCurator.teams(code);
        team = teams.find((t) => t.campusId === campusId);
      }
      if (!team) {
        const reason = report.skipped[0]?.reason;
        throw new Error(
          reason
            ? `This school couldn't join: ${reason}`
            : "This school couldn't join this competition.",
        );
      }
      if (patch && Object.keys(patch).length > 0) {
        team = await nsmqCurator.updateTeam(team.id, patch);
      }
      return team;
    },
    onSuccess: (_, { code }) => {
      invalidateTeams(code);
      toast.success("Team registered");
    },
    onError: (error) => {
      toastCuratorError(error, { fallback: "Failed to register team" });
    },
  });

  const tagSchoolsMutation = useMutation({
    mutationFn: ({ code, campusIds }: { code: string; campusIds: UUID[] }) =>
      nsmqCurator.tagTeams(code, campusIds),
    onSuccess: (report, { code }) => {
      invalidateTeams(code);
      if (report.skipped.length > 0) {
        toast.warning(
          `Tagged ${report.added.length}, skipped ${report.skipped.length}: ${describeSkipped(report.skipped)}`,
        );
      } else {
        toast.success("Schools tagged into the competition");
      }
    },
    onError: (error) => {
      toastCuratorError(error, { fallback: "Failed to tag schools" });
    },
  });

  const untagSchoolMutation = useMutation({
    mutationFn: ({ code, campusId }: { code: string; campusId: UUID }) =>
      nsmqCurator.untagTeam(code, campusId),
    onSuccess: (_, { code }) => {
      invalidateTeams(code);
      toast.success("School removed from the competition");
    },
    // 409 TEAM_HAS_MEMBERS: the server's detail says students already joined.
    onError: (error) => {
      toastCuratorError(error, { fallback: "Failed to remove the school" });
    },
  });

  const importFixturesMutation = useMutation({
    mutationFn: ({ code, rows }: { code: string; rows: ImportRow[] }) =>
      nsmqCurator.importFixtures(code, rows),
    onSuccess: (fixtures, { code }) => {
      invalidateTeams(code);
      toast.success(
        `Imported ${fixtures.length} fixture${fixtures.length === 1 ? "" : "s"}`,
      );
    },
    // All or nothing: a bad row answers 400 VALIDATION with `rows[i]` fields.
    onError: (error) => {
      toastCuratorError(error, { fallback: "Failed to import fixtures" });
    },
  });

  return {
    useVersions,
    useVersion,
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
