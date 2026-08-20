"use client";

import { useState } from "react";
import { useSetAtom } from "jotai";
import { Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { currentCompetitionCodeAtom } from "@/atoms/competitions";
import useVersionsQuery from "@/hooks/curator/competitions/use-versions";
import type { Team } from "@/lib/types/api/competitions";

interface JoinCompetitionPillProps {
  schoolId: string | number;
  onRegistered: (team: Team) => void;
}

/**
 * Shown in place of the Next Contest pill when this school isn't a team in
 * any competition yet — a team is a separate resource from a school (see
 * the curator "Teams & Fixtures" API), so Access Codes/Fixtures have
 * nothing to attach to until one exists. Registers right here instead of
 * requiring a detour through the Competitions area first.
 */
export function JoinCompetitionPill({
  schoolId,
  onRegistered,
}: JoinCompetitionPillProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const setCurrentCode = useSetAtom(currentCompetitionCodeAtom);
  const { registerTeam, isRegisteringTeam } = useVersionsQuery();

  const handleJoin = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    const team = await registerTeam({
      code: trimmed,
      data: { campusId: schoolId },
    });
    setCurrentCode(trimmed);
    onRegistered(team);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-foreground inline-flex shrink-0 items-center gap-2 rounded-full border-[1.6px] border-dashed border-[rgba(232,212,173,.55)] bg-[rgba(232,212,173,.1)] px-3 py-2 text-xs font-extrabold backdrop-blur-[8px] transition-all hover:-translate-y-0.5 hover:border-[var(--gold-hi)]"
      >
        <Trophy className="size-3.5 shrink-0" />
        Join a competition
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Join a competition</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Registers this school as a team so it can have access codes
              and fixtures.
            </p>
            <div>
              <Label htmlFor="join-code">Competition code</Label>
              <Input
                id="join-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. NSMQ2026"
              />
            </div>
            <LoadingButton
              onClick={handleJoin}
              loading={isRegisteringTeam}
              loadingText="Joining..."
              disabled={!code.trim()}
              className="w-full"
            >
              Join
            </LoadingButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
