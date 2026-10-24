"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Route } from "next";
import { Star, Users, KeyRound, CalendarClock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { LoadingButton } from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";
import { currentCompetitionCodeAtom } from "@/atoms/competitions";
import useVersionsQuery from "@/hooks/curator/competitions/use-versions";
import { formatKickoff } from "@/hooks/curator/competitions/use-fixtures";
import { DYNAMIC_ROUTES } from "@/lib/constants/infra/routes";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { campusesCurator } from "@/lib/v2/curator/campuses";
import type { ImportRow, TeamView } from "@/lib/v2/curator/nsmq";

// The tag picker lists campuses straight from v2 (one page of the largest size).
const CAMPUS_PICKER_SIZE = 100;

/** `<input type="date">` value for an ISO instant. */
const toDateInput = (iso: string | null | undefined) => iso?.slice(0, 10) ?? "";

export default function CompetitionVersionPage() {
  const params = useParams();
  const router = useRouter();
  const versionCode = params.versionCode as string;
  const setCurrentCode = useSetAtom(currentCompetitionCodeAtom);

  // The team page reads its team from this same version's team list, which
  // is already cached here, so navigating doesn't refetch it.
  const openTeam = (team: TeamView) => {
    router.push(
      DYNAMIC_ROUTES.curator.teamDetails(versionCode, team.id) as Route,
    );
  };

  const {
    useVersion,
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
  const { data: version } = useVersion(versionCode);
  const { data: teams, isLoading } = useVersionTeams(versionCode);
  const { data: campusPage } = useQuery({
    queryKey: [QUERY_KEYS.campuses, "picker", CAMPUS_PICKER_SIZE],
    queryFn: () => campusesCurator.list({ size: CAMPUS_PICKER_SIZE }),
    staleTime: 5 * 60 * 1000,
  });
  const schools = campusPage?.items ?? [];

  const registeredCampusIds = new Set((teams ?? []).map((t) => t.campusId));
  const unregisteredSchools = schools.filter(
    (s) => !registeredCampusIds.has(s.id),
  );

  const [selectedSchoolIds, setSelectedSchoolIds] = useState<Set<string>>(
    new Set(),
  );
  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [fixturesJson, setFixturesJson] = useState("");
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
    try {
      await tagSchools({
        code: versionCode,
        campusIds: Array.from(selectedSchoolIds),
      });
      setSelectedSchoolIds(new Set());
    } catch {
      // Toasted by the hook.
    }
  };

  const handleRegisterSelected = async () => {
    const [campusId] = Array.from(selectedSchoolIds);
    if (!campusId) return;
    // A school that's already a team resolves to that team (no error), so a
    // stale selection never leaves the curator stuck.
    try {
      await registerTeam({ code: versionCode, campusId });
      setSelectedSchoolIds(new Set());
    } catch {
      // Toasted by the hook.
    }
  };

  const openPeriodForm = () => {
    setStartsAt(toDateInput(version?.startsAt));
    setEndsAt(toDateInput(version?.endsAt));
    setShowPeriodForm((v) => !v);
  };

  const handleSetPeriod = async () => {
    // A PATCH leaves omitted fields as they are, so a cleared date is not sent.
    // TODO(v2-backend): no way to clear startsAt/endsAt once set (null means "unchanged").
    try {
      await setPeriod({
        code: versionCode,
        startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
      });
      setShowPeriodForm(false);
    } catch {
      // Toasted by the hook (409 STALE reloads the version first).
    }
  };

  const handleImportFixtures = async () => {
    let rows: ImportRow[];
    try {
      rows = JSON.parse(fixturesJson);
    } catch {
      toast.error("That isn't valid JSON");
      return;
    }
    if (!Array.isArray(rows) || rows.length === 0) {
      toast.error("Paste a JSON array with at least one fixture");
      return;
    }
    try {
      await importFixtures({ code: versionCode, rows });
      setFixturesJson("");
      setShowImport(false);
    } catch {
      // All or nothing: the hook toasts the first bad row's message.
    }
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
              {version?.label ?? versionCode}
            </h1>
            {version && (
              <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                {version.code}
                <Badge variant="secondary">{version.status}</Badge>
              </p>
            )}
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
            <Button type="button" variant="outline" onClick={openPeriodForm}>
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
                placeholder='[{"campusId":"<campus uuid>","roundName":"Quarter-final","kickoffAt":"2026-09-01T12:00:00Z","timezone":"Africa/Accra","venue":"..."}]'
                className="border-border bg-card mt-1 w-full rounded-lg border p-2 font-mono text-xs"
              />
              {/* TODO(v2-backend): no "replace existing fixtures" option; imports only add. */}
              <p className="text-muted-foreground mt-1 text-xs">
                All or nothing: if any row names a campus that isn&apos;t taking
                part, nothing is imported and that row is reported.
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
                    {team.members}
                    {team.seatCapacity != null && `/${team.seatCapacity}`}
                  </span>
                  {/* TODO(v2-backend): TeamView has no issued/redeemed code counts. */}
                  <span className="flex items-center gap-1">
                    <KeyRound className="size-3.5" />
                    {team.status}
                  </span>
                  {team.nextKickoff && (
                    <span className="flex items-center gap-1">
                      <CalendarClock className="size-3.5" />
                      {formatKickoff({
                        kickoffAt: team.nextKickoff,
                        timezone: null,
                      })}
                    </span>
                  )}
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
                    key={school.id}
                    className="border-border/60 hover:bg-muted/40 flex items-center gap-3 border-b p-3 last:border-b-0"
                  >
                    <Checkbox
                      checked={selectedSchoolIds.has(school.id)}
                      onCheckedChange={() => toggleSchool(school.id)}
                    />
                    <span className="text-foreground text-sm font-bold">
                      {school.fullName}
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
                  onClick={handleRegisterSelected}
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
