"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Power, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoadingButton } from "@/components/ui/loading-button";
import useFixturesQuery from "@/hooks/curator/competitions/use-fixtures";
import type { Fixture } from "@/lib/types/api/competitions";
import { cn } from "@/lib/utils";

interface NextFixturePillProps {
  teamId: number;
  fixtures: Fixture[];
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const TIMES = [
  "7am",
  "8am",
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
  "6pm",
  "7pm",
  "8pm",
] as const;

function daysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function parseTime(time: string): { hour: number; minute: number } {
  const match = /^(\d{1,2})(am|pm)$/i.exec(time);
  if (!match) return { hour: 12, minute: 0 };
  let hour = Number(match[1]) % 12;
  if (match[2].toLowerCase() === "pm") hour += 12;
  return { hour, minute: 0 };
}

function formatTime(date: Date): string {
  const h = date.getHours();
  const period = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}${period}`;
}

function relativeLabel(date: Date): string {
  const now = new Date();
  const day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const when = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((when.getTime() - day0.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 0)
    return `${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} ago`;
  if (diff < 7) return `In ${diff} days`;
  if (diff < 14) return "Next week";
  return `In ${Math.round(diff / 7)} weeks`;
}

function soonestFixture(fixtures: Fixture[]): Fixture | null {
  if (fixtures.length === 0) return null;
  return [...fixtures].sort((a, b) => a.ordinal - b.ordinal)[0];
}

/**
 * Compact "next contest" pill + editor — matches the mock's `.m-class`
 * pill and `#nqBack`/`.nq` "Next Contest" popover in
 * guide/Bronze Fury A_33.html: a dark glass card with a big gold date, a
 * relative label, three tap-to-pick fields (month/day/time), and a power
 * toggle. Pickers are always shown (not just when a fixture already
 * exists) so there's an actual way to choose the first date — the toggle
 * only comes into play once a fixture exists, to turn it back off.
 */
export function NextFixturePill({ teamId, fixtures }: NextFixturePillProps) {
  const [open, setOpen] = useState(false);
  const next = soonestFixture(fixtures);

  const [draftDate, setDraftDate] = useState<Date>(() => new Date());
  const [openPicker, setOpenPicker] = useState<
    "month" | "day" | "time" | null
  >(null);

  const {
    addFixture,
    updateFixture,
    deleteFixture,
    isAddingFixture,
    isUpdatingFixture,
    isDeletingFixture,
  } = useFixturesQuery();
  const isBusy = isAddingFixture || isUpdatingFixture || isDeletingFixture;

  useEffect(() => {
    if (open) {
      setDraftDate(next ? new Date(next.scheduledAt) : new Date());
      setOpenPicker(null);
    }
  }, [open, next]);

  const originalTime = next ? new Date(next.scheduledAt).getTime() : null;
  // No existing fixture means anything picked is unsaved by definition.
  const isDirty = originalTime === null || draftDate.getTime() !== originalTime;

  const setMonth = (monthIndex: number) => {
    const d = new Date(draftDate);
    const maxDay = daysInMonth(monthIndex, d.getFullYear());
    d.setMonth(monthIndex, Math.min(d.getDate(), maxDay));
    setDraftDate(d);
    setOpenPicker(null);
  };
  const setDay = (day: number) => {
    const d = new Date(draftDate);
    d.setDate(day);
    setDraftDate(d);
    setOpenPicker(null);
  };
  const setTime = (time: string) => {
    const { hour, minute } = parseTime(time);
    const d = new Date(draftDate);
    d.setHours(hour, minute, 0, 0);
    setDraftDate(d);
    setOpenPicker(null);
  };

  const handleSave = async () => {
    const data = {
      roundName: next?.roundName || "NSMQ",
      scheduledAt: draftDate.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      venue: next?.venue ?? "",
      ordinal: next?.ordinal ?? fixtures.length,
    };
    if (next) {
      await updateFixture({ fixtureId: next.id, teamId, data });
    } else {
      await addFixture({ teamId, data });
    }
  };

  const handleTurnOff = async () => {
    if (!next) return;
    await deleteFixture({ fixtureId: next.id, teamId });
    setOpen(false);
  };

  const days = Array.from(
    { length: daysInMonth(draftDate.getMonth(), draftDate.getFullYear()) },
    (_, i) => i + 1,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-foreground inline-flex shrink-0 items-center gap-2 rounded-full border-[1.6px] border-dashed border-[rgba(232,212,173,.55)] bg-[rgba(232,212,173,.1)] px-3 py-2 text-left text-xs font-extrabold backdrop-blur-[8px] transition-all hover:-translate-y-0.5 hover:border-[var(--gold-hi)]"
      >
        <CalendarClock className="size-3.5 shrink-0" />
        <span className="flex flex-col leading-tight">
          <span>{next?.roundName || "No contest set"}</span>
          {next && (
            <span className="text-muted-foreground/80 font-bold normal-case">
              {next.whenLabel}
            </span>
          )}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-xs border border-white/10 bg-[#2b1210] p-0 text-[#f4f2ef] sm:max-w-sm"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-lg font-extrabold">
                Next <span className="font-normal text-white/50">Contest</span>
              </p>
              <p className="text-xs font-bold text-white/40 uppercase">
                {next?.roundName || "NSMQ"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex size-8 items-center justify-center rounded-full bg-white/5 text-white/60 hover:bg-white/10"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-1 px-5 pt-5">
            <p className="text-2xl font-extrabold text-[var(--gold-hi)]">
              {MONTHS[draftDate.getMonth()]} {draftDate.getDate()},{" "}
              {formatTime(draftDate)}
            </p>
            <p className="text-sm font-bold text-white/40">
              {isDirty ? "Not saved yet" : relativeLabel(draftDate)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 px-5 pt-4">
            {[
              {
                key: "month" as const,
                label: "Month",
                value: MONTHS[draftDate.getMonth()],
              },
              {
                key: "day" as const,
                label: "Day",
                value: String(draftDate.getDate()),
              },
              {
                key: "time" as const,
                label: "Time",
                value: formatTime(draftDate),
              },
            ].map((field) => (
              <div key={field.key} className="relative">
                <p className="mb-1 text-center text-[10px] font-bold tracking-[.1em] text-white/40 uppercase">
                  {field.label}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setOpenPicker((p) => (p === field.key ? null : field.key))
                  }
                  className="w-full rounded-full border border-white/10 bg-white/[.06] py-2 text-center text-sm font-extrabold text-[var(--gold-hi)]"
                >
                  {field.value}
                </button>
                {openPicker === field.key && (
                  <div className="absolute top-full left-0 z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-white/10 bg-[#3b1a17] shadow-lg">
                    {field.key === "month" &&
                      MONTHS.map((m, i) => (
                        <div
                          key={m}
                          onClick={() => setMonth(i)}
                          className={cn(
                            "cursor-pointer px-3 py-1.5 text-sm text-white/80 hover:bg-white/10",
                            i === draftDate.getMonth() &&
                              "text-[var(--gold-hi)] font-extrabold",
                          )}
                        >
                          {m}
                        </div>
                      ))}
                    {field.key === "day" &&
                      days.map((d) => (
                        <div
                          key={d}
                          onClick={() => setDay(d)}
                          className={cn(
                            "cursor-pointer px-3 py-1.5 text-sm text-white/80 hover:bg-white/10",
                            d === draftDate.getDate() &&
                              "text-[var(--gold-hi)] font-extrabold",
                          )}
                        >
                          {d}
                        </div>
                      ))}
                    {field.key === "time" &&
                      TIMES.map((t) => (
                        <div
                          key={t}
                          onClick={() => setTime(t)}
                          className={cn(
                            "cursor-pointer px-3 py-1.5 text-sm text-white/80 hover:bg-white/10",
                            t === formatTime(draftDate) &&
                              "text-[var(--gold-hi)] font-extrabold",
                          )}
                        >
                          {t}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-[10px] font-bold tracking-[.08em] text-white/40 uppercase">
              {isDirty
                ? next
                  ? "Save to move the contest"
                  : "Save to set the contest"
                : "Tap a field to move the contest"}
            </p>
            {isDirty ? (
              <LoadingButton
                onClick={handleSave}
                loading={isBusy}
                loadingText="Saving..."
                className="h-8 rounded-full px-4 text-xs"
              >
                Save
              </LoadingButton>
            ) : (
              <button
                type="button"
                onClick={handleTurnOff}
                disabled={isBusy}
                className="flex size-9 items-center justify-center rounded-full border-2 border-dashed border-[var(--gold-hi)] text-[var(--gold-hi)] transition-colors disabled:opacity-50"
                title="Turn off"
              >
                <Power className="size-4" />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
