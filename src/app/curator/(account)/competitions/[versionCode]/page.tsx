"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Route } from "next";
import { Star, Users, KeyRound, CalendarClock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingButton } from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";
import { currentCompetitionCodeAtom } from "@/atoms/competitions";
import useVersionsQuery from "@/hooks/curator/competitions/use-versions";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import { DYNAMIC_ROUTES } from "@/lib/constants/infra/routes";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import type { ImportFixtureRow, Team } from "@/lib/types/api/competitions";

export default function CompetitionVersionPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const versionCode = params.versionCode as string;
  const setCurrentCode = useSetAtom(currentCompetitionCodeAtom);

  // The team list here already has each team's full object (fixtures
  // included) — seed the team-detail page's own cache entry with it before
  // navigating, instead of refetching data we already have in hand.
  const openTeam = (team: Team) => {
    queryClient.setQueryData(
      [QUERY_KEYS.competitionTeam, "single", String(team.id)],
      team,
    );
    router.push(
      DYNAMIC_ROUTES.curator.teamDetails(versionCode, team.id) as Route,
    );
  };

  const {
    useVersionTeams,
    setPeriod,
    isSettingPeriod,
    registerTeam,
    isRegisteringTeam,
    tagSchools,
    isTaggingSchools,
    importFixtures,
    isImportingFixtures,
  } = useVersionsQuery();
  const { data: teams, isLoading } = useVersionTeams(versionCode);
  const { useSchools } = useSchoolsQuery();
  const { data: schools = [] } = useSchools();

  const registeredCampusIds = new Set(
    (teams ?? []).map((t) => String(t.campusId)),
  );
  const unregisteredSchools = schools.filter(
    (s) => !registeredCampusIds.has(String(s.id)),
  );

  const [selectedSchoolIds, setSelectedSchoolIds] = useState<Set<string>>(
    new Set(),
  );
  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [fixturesJson, setFixturesJson] = useState("");
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const toggleSchool = (id: string) => {
    setSelectedSchoolIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleTagSelected = async () => {
    if (selectedSchoolIds.size === 0) return;
    await tagSchools({
      code: versionCode,
      data: { campusIds: Array.from(selectedSchoolIds) },
    });
    setSelectedSchoolIds(new Set());
  };

  const handleSetPeriod = async () => {
    await setPeriod({
      code: versionCode,
      data: {
        startsAt: startsAt ? new Date(startsAt).toISOString() : null,
        endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      },
    });
    setShowPeriodForm(false);
  };

  const handleImportFixtures = async () => {
    let fixtures: ImportFixtureRow[];
    try {
      fixtures = JSON.parse(fixturesJson);
    } catch {
      toast.error("That isn't valid JSON");
      return;
    }
    await importFixtures({
      code: versionCode,
      data: { replaceExisting, fixtures },
    });
    setFixturesJson("");
    setShowImport(false);
  };

  return (
    <div className="bg-app-gradient min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs font-bold tracking-[.1em] uppercase">
              Competition
            </p>
            <h1 className="text-foreground text-2xl font-extrabold tracking-tight">
              {versionCode}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-1.5"
              onClick={() => setCurrentCode(versionCode)}
            >
              <Star className="size-4" />
              Set as current competition
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPeriodForm((v) => !v)}
            >
              <CalendarClock className="mr-1.5 size-4" />
              Set season
            </Button>
          </div>
        </div>

        {showPeriodForm && (
          <div className="border-border mb-6 flex flex-wrap items-end gap-3 rounded-xl border p-4">
            <div>
              <Label htmlFor="starts-at">Starts</Label>
              <Input
                id="starts-at"
                type="date"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ends-at">Ends</Label>
              <Input
                id="ends-at"
                type="date"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>
            <LoadingButton
              onClick={handleSetPeriod}
              loading={isSettingPeriod}
              loadingText="Saving..."
            >
              Save
            </LoadingButton>
          </div>
        )}

        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-foreground text-lg font-extrabold">Teams</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowImport((v) => !v)}
            >
              Bulk import fixtures
            </Button>
          </div>

          {showImport && (
            <div className="border-border mb-4 rounded-xl border p-4">
              <Label htmlFor="fixtures-json">
                Paste a JSON array of fixtures, one per campus
              </Label>
              <textarea
                id="fixtures-json"
                value={fixturesJson}
                onChange={(e) => setFixturesJson(e.target.value)}
                rows={6}
                placeholder='[{"campusId":52,"roundName":"Quarter-final","scheduledAt":"2026-09-01T12:00:00Z","venue":"..."}]'
                className="border-border bg-card mt-1 w-full rounded-lg border p-2 font-mono text-xs"
              />
              <label className="mt-2 flex items-center gap-2 text-sm">
                <Checkbox
                  checked={replaceExisting}
                  onCheckedChange={(c) => setReplaceExisting(c === true)}
                />
                Replace existing fixtures for these campuses
              </label>
              <p className="text-muted-foreground mt-1 text-xs">
                A campus with no team here is skipped and reported, not
                dropped silently.
              </p>
              <LoadingButton
                onClick={handleImportFixtures}
                loading={isImportingFixtures}
                loadingText="Importing..."
                disabled={!fixturesJson.trim()}
                className="mt-2"
              >
                Import
              </LoadingButton>
            </div>
          )}

          {isLoading && (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          )}

          {!isLoading && (teams ?? []).length === 0 && (
            <p className="text-muted-foreground text-sm">
              No teams registered in this competition yet.
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {(teams ?? []).map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => openTeam(team)}
                className="border-border bg-card/40 hover:border-primary/50 flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors"
              >
                <p className="text-foreground font-extrabold">
                  {team.campusName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {team.coordinatorName || "No coordinator set"}
                </p>
                <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" />
                    {team.memberCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <KeyRound className="size-3.5" />
                    {team.redeemedCodes}/{team.issuedCodes} redeemed
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-foreground mb-3 text-lg font-extrabold">
            Register / tag schools
          </h2>
          {unregisteredSchools.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Every school is already registered in this competition.
            </p>
          ) : (
            <>
              <div className="border-border max-h-72 overflow-y-auto rounded-xl border">
                {unregisteredSchools.map((school) => (
                  <label
                    key={String(school.id)}
                    className="border-border/60 hover:bg-muted/40 flex items-center gap-3 border-b p-3 last:border-b-0"
                  >
                    <Checkbox
                      checked={selectedSchoolIds.has(String(school.id))}
                      onCheckedChange={() => toggleSchool(String(school.id))}
                    />
                    <span className="text-foreground text-sm font-bold">
                      {school.name}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <LoadingButton
                  onClick={handleTagSelected}
                  loading={isTaggingSchools}
                  loadingText="Tagging..."
                  disabled={selectedSchoolIds.size === 0}
                >
                  Tag {selectedSchoolIds.size || ""} school
                  {selectedSchoolIds.size === 1 ? "" : "s"}
                </LoadingButton>
                <LoadingButton
                  variant="outline"
                  loading={isRegisteringTeam}
                  loadingText="Registering..."
                  disabled={selectedSchoolIds.size !== 1}
                  onClick={async () => {
                    const [campusId] = Array.from(selectedSchoolIds);
                    await registerTeam({
                      code: versionCode,
                      data: { campusId },
                    });
                    setSelectedSchoolIds(new Set());
                  }}
                >
                  Register as a full team
                </LoadingButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
