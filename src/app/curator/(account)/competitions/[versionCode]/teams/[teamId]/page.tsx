"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { KeyRound, Plus, Trash2, Pencil, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useTeamsQuery from "@/hooks/curator/competitions/use-teams";
import useFixturesQuery, {
  DEFAULT_FIXTURE_TIMEZONE,
  formatKickoff,
} from "@/hooks/curator/competitions/use-fixtures";
import { SchoolAccessCodesSheet } from "@/components/curator/school-details";
import type { FixtureOutcome, FixtureView } from "@/lib/v2/curator/nsmq";
import { fieldMessage } from "@/lib/v2/curator/errors";

const TEAM_STATUS_BADGE: Record<
  string,
  "secondary" | "default" | "destructive"
> = {
  REGISTERED: "secondary",
  ACTIVE: "default",
  ELIMINATED: "destructive",
  CHAMPION: "default",
};

type FixtureForm = {
  roundName: string;
  kickoffAt: string;
  timezone: string;
  venue: string;
  position: number;
};

// The fixture's display zone, not the curator's own browser timezone, which
// could be anywhere. Every school here is in Ghana.
const EMPTY_FIXTURE_FORM: FixtureForm = {
  roundName: "",
  kickoffAt: "",
  timezone: DEFAULT_FIXTURE_TIMEZONE,
  venue: "",
  position: 0,
};

const FIXTURE_FIELDS = ["roundName", "kickoffAt", "venue", "position"] as const;
type FixtureField = (typeof FIXTURE_FIELDS)[number];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive mt-1 text-xs">{message}</p>;
}

export default function CompetitionTeamPage() {
  const params = useParams();
  const versionCode = params.versionCode as string;
  const teamId = params.teamId as string;
  const [showAccessCodes, setShowAccessCodes] = useState(false);
  const [editingFixture, setEditingFixture] = useState<FixtureView | null>(
    null,
  );
  const [showFixtureForm, setShowFixtureForm] = useState(false);
  const [showEliminateConfirm, setShowEliminateConfirm] = useState(false);
  const [form, setForm] = useState<FixtureForm>(EMPTY_FIXTURE_FORM);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FixtureField, string>>
  >({});

  const { useTeam, updateTeam, isUpdatingTeam } = useTeamsQuery();
  const { data: team, isLoading } = useTeam(versionCode, teamId);

  const handleEliminate = async () => {
    await updateTeam({ teamId, data: { status: "ELIMINATED" } });
    setShowEliminateConfirm(false);
  };
  const {
    useFixtures,
    addFixture,
    updateFixture,
    deleteFixture,
    recordOutcome,
    isAddingFixture,
    isUpdatingFixture,
    isDeletingFixture,
    isRecordingOutcome,
  } = useFixturesQuery();

  const { data: fixtures = [] } = useFixtures(teamId);

  const openNewFixture = () => {
    setEditingFixture(null);
    setFieldErrors({});
    setForm({ ...EMPTY_FIXTURE_FORM, position: fixtures.length });
    setShowFixtureForm(true);
  };

  const openEditFixture = (fixture: FixtureView) => {
    setEditingFixture(fixture);
    setFieldErrors({});
    setForm({
      roundName: fixture.roundName,
      kickoffAt: fixture.kickoffAt,
      timezone: fixture.timezone || DEFAULT_FIXTURE_TIMEZONE,
      venue: fixture.venue ?? "",
      position: fixture.position,
    });
    setShowFixtureForm(true);
  };

  const handleSaveFixture = async () => {
    setFieldErrors({});
    try {
      if (editingFixture) {
        // `version` guards the edit; a stale one reloads the list (409 STALE).
        await updateFixture({
          fixtureId: editingFixture.id,
          teamId,
          data: { version: editingFixture.version, ...form },
        });
      } else {
        await addFixture({
          teamId,
          data: { ...form, venue: form.venue || null },
        });
      }
      setShowFixtureForm(false);
    } catch (error) {
      // The hook toasts the problem's detail; field messages sit by each input.
      setFieldErrors(
        Object.fromEntries(
          FIXTURE_FIELDS.map((f) => [f, fieldMessage(error, f)]),
        ),
      );
    }
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
            <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
              Seats: {team.members}/{team.seatCapacity ?? "∞"} · Status:{" "}
              <Badge variant={TEAM_STATUS_BADGE[team.status] ?? "secondary"}>
                {team.status}
              </Badge>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {team.status !== "ELIMINATED" && (
              <Button
                type="button"
                variant="outline"
                className="text-destructive hover:text-destructive gap-1.5"
                onClick={() => setShowEliminateConfirm(true)}
              >
                <UserX className="size-4" />
                Mark as Out
              </Button>
            )}
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
        </div>

        <Dialog
          open={showEliminateConfirm}
          onOpenChange={setShowEliminateConfirm}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark {team.campusName} as out?</DialogTitle>
              <DialogDescription>
                This eliminates the team from the competition. They&apos;ll stay
                visible in results, but marked out of future rounds.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEliminateConfirm(false)}
                disabled={isUpdatingTeam}
              >
                Cancel
              </Button>
              <LoadingButton
                onClick={handleEliminate}
                loading={isUpdatingTeam}
                loadingText="Marking as out..."
                variant="destructive"
              >
                Mark as Out
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                aria-invalid={!!fieldErrors.roundName}
              />
              <FieldError message={fieldErrors.roundName} />
            </div>
            <div>
              <Label htmlFor="tf-when">Date & time</Label>
              <Input
                id="tf-when"
                type="datetime-local"
                value={form.kickoffAt?.slice(0, 16) ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    kickoffAt: new Date(e.target.value).toISOString(),
                  })
                }
                aria-invalid={!!fieldErrors.kickoffAt}
              />
              <FieldError message={fieldErrors.kickoffAt} />
            </div>
            <div>
              <Label htmlFor="tf-venue">Venue</Label>
              <Input
                id="tf-venue"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                aria-invalid={!!fieldErrors.venue}
              />
              <FieldError message={fieldErrors.venue} />
            </div>
            <div>
              <Label htmlFor="tf-ordinal">Order</Label>
              <Input
                id="tf-ordinal"
                type="number"
                value={form.position}
                onChange={(e) =>
                  setForm({ ...form, position: Number(e.target.value) || 0 })
                }
                className="w-20"
                aria-invalid={!!fieldErrors.position}
              />
              <FieldError message={fieldErrors.position} />
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
            .sort((a, b) => a.position - b.position)
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
                    {formatKickoff(fixture)} · {fixture.venue || "No venue"}
                  </p>
                </div>
                <Badge
                  variant={
                    fixture.status === "CANCELLED" ? "destructive" : "secondary"
                  }
                >
                  {fixture.status === "CANCELLED"
                    ? "Cancelled"
                    : fixture.outcome}
                </Badge>
                <select
                  value={fixture.outcome}
                  disabled={
                    isRecordingOutcome || fixture.status === "CANCELLED"
                  }
                  onChange={(e) =>
                    recordOutcome({
                      fixtureId: fixture.id,
                      teamId,
                      outcome: e.target.value as FixtureOutcome,
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
