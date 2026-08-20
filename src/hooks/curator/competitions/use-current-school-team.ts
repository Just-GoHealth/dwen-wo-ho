"use client";
import { useAtomValue } from "jotai";
import { currentCompetitionCodeAtom } from "@/atoms/competitions";
import useVersionsQuery from "./use-versions";

/**
 * Resolves "this school's team in the currently-set competition" — there's
 * no get-team-by-school endpoint, only list-teams-in-a-version, so this
 * fetches that version's teams and matches by campusId (== school id).
 * Returns `team: null` (not loading) when no competition code is set yet.
 */
export function useCurrentSchoolTeam(schoolId: string | number) {
  const currentCode = useAtomValue(currentCompetitionCodeAtom);
  const { useVersionTeams } = useVersionsQuery();
  const { data: teams, isLoading } = useVersionTeams(currentCode ?? "", {
    enabled: !!currentCode,
  });

  const team =
    teams?.find((t) => String(t.campusId) === String(schoolId)) ?? null;

  return {
    team,
    isLoading: !!currentCode && isLoading,
    hasCompetition: !!currentCode,
  };
}
