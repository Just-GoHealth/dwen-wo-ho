"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { KeyRound, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import useTeamsQuery from "@/hooks/curator/competitions/use-teams";
import useFixturesQuery from "@/hooks/curator/competitions/use-fixtures";
import { SchoolAccessCodesSheet } from "@/components/curator/school-details";
import type { AddFixtureRequest, Fixture } from "@/lib/types/api/competitions";

const EMPTY_FIXTURE_FORM = {
  roundName: "",
  scheduledAt: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  venue: "",
  ordinal: 0,
};

export default function CompetitionTeamPage() {
  const params = useParams();
  const teamId = Number(params.teamId);
  const [showAccessCodes, setShowAccessCodes] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [showFixtureForm, setShowFixtureForm] = useState(false);
  const [form, setForm] = useState<AddFixtureRequest>(EMPTY_FIXTURE_FORM);

  const { useTeam } = useTeamsQuery();
  const { data: team, isLoading } = useTeam(teamId);
  const {
    addFixture,
    updateFixture,
    deleteFixture,
    recordOutcome,
    isAddingFixture,
    isUpdatingFixture,
    isDeletingFixture,
    isRecordingOutcome,
  } = useFixturesQuery();

  const fixtures = team?.fixtures ?? [];

  const openNewFixture = () => {
    setEditingFixture(null);
    setForm({ ...EMPTY_FIXTURE_FORM, ordinal: fixtures.length });
    setShowFixtureForm(true);
  };

  const openEditFixture = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setForm({
      roundName: fixture.roundName,
      scheduledAt: fixture.scheduledAt,
      timezone: fixture.timezone,
      venue: fixture.venue,
      ordinal: fixture.ordinal,
    });
    setShowFixtureForm(true);
  };

  const handleSaveFixture = async () => {
    if (editingFixture) {
      await updateFixture({ fixtureId: editingFixture.id, teamId, data: form });
    } else {
      await addFixture({ teamId, data: form });
    }
    setShowFixtureForm(false);
  };

  if (isLoading || !team) {
    return (
      <div className="bg-app-gradient min-h-screen px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-app-gradient min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-foreground text-2xl font-extrabold tracking-tight">
              {team.campusName}
            </h1>
            <p className="text-muted-foreground text-sm">
              {team.coordinatorName || "No coordinator"}
              {team.coordinatorContact ? ` · ${team.coordinatorContact}` : ""}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Seats: {team.memberCount}/{team.seatCapacity} · Status:{" "}
              {team.status}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="gap-1.5"
            onClick={() => setShowAccessCodes(true)}
          >
            <KeyRound className="size-4" />
            Access Codes
          </Button>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-extrabold">Fixtures</h2>
          <Button
            type="button"
            size="sm"
            onClick={openNewFixture}
            className="gap-1.5"
          >
            <Plus className="size-3.5" />
            Add fixture
          </Button>
        </div>

        {showFixtureForm && (
          <div className="border-border mb-4 flex flex-wrap items-end gap-3 rounded-xl border p-4">
            <div>
              <Label htmlFor="tf-round">Round</Label>
              <Input
                id="tf-round"
                value={form.roundName}
                onChange={(e) =>
                  setForm({ ...form, roundName: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="tf-when">Date & time</Label>
              <Input
                id="tf-when"
                type="datetime-local"
                value={form.scheduledAt?.slice(0, 16) ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    scheduledAt: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="tf-venue">Venue</Label>
              <Input
                id="tf-venue"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tf-ordinal">Order</Label>
              <Input
                id="tf-ordinal"
                type="number"
                value={form.ordinal}
                onChange={(e) =>
                  setForm({ ...form, ordinal: Number(e.target.value) || 0 })
                }
                className="w-20"
              />
            </div>
            <LoadingButton
              onClick={handleSaveFixture}
              loading={isAddingFixture || isUpdatingFixture}
              loadingText="Saving..."
            >
              Save
            </LoadingButton>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {fixtures.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No fixtures scheduled yet.
            </p>
          )}
          {[...fixtures]
            .sort((a, b) => a.ordinal - b.ordinal)
            .map((fixture) => (
              <div
                key={fixture.id}
                className="border-border flex items-center gap-3 rounded-xl border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-foreground font-bold">
                    {fixture.roundName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {fixture.whenLabel} · {fixture.venue || "No venue"}
                  </p>
                </div>
                <Badge variant="secondary">{fixture.outcome}</Badge>
                <select
                  value={fixture.outcome}
                  disabled={isRecordingOutcome}
                  onChange={(e) =>
                    recordOutcome({
                      fixtureId: fixture.id,
                      teamId,
                      data: {
                        outcome: e.target.value as Fixture["outcome"],
                      },
                    })
                  }
                  className="border-border rounded-md border bg-transparent px-2 py-1 text-xs"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="ELIMINATED">Eliminated</option>
                </select>
                <button
                  type="button"
                  onClick={() => openEditFixture(fixture)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  disabled={isDeletingFixture}
                  onClick={() =>
                    deleteFixture({ fixtureId: fixture.id, teamId })
                  }
                  className="text-destructive/70 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
        </div>
      </div>

      <SchoolAccessCodesSheet
        open={showAccessCodes}
        onOpenChange={setShowAccessCodes}
        teamId={teamId}
        teamName={team.campusName}
      />
    </div>
  );
}
