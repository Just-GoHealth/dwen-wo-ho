"use client";

import { useState } from "react";
import { TriageBadge } from "@just-gohealth/ui";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { ApiErrorNote } from "@/components/shared/api-error-note";
import {
  useClearances,
  useStaffRun,
} from "@/hooks/provider/school-details/use-school-details";
import type { DescribedApiError } from "@/lib/utils/shared/api-error";
import type { CareCase } from "@/lib/v2/types";

const MAX_NOTE = 2000;

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString() : "—";

/**
 * An NSMQ care case: the source run (tag, reason, sections), the response
 * deadline, past clearances, and — for a standing 911 — clearing it with a
 * note (only the campus's NSMQ counsellor may; others get 403).
 */
export function CareCaseSheet({
  careCase,
  onClose,
  onClear,
  isClearing,
}: {
  careCase: CareCase | null;
  onClose: () => void;
  onClear: (caseId: string, note: string) => Promise<DescribedApiError | null>;
  isClearing: boolean;
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<DescribedApiError | null>(null);
  const { data: run } = useStaffRun(careCase?.sourceRunId ?? null);
  const { data: clearances = [] } = useClearances(careCase?.id ?? null);
  const isStanding911 = careCase?.effectiveTag === "911" && !careCase.clearedAt;
  const overdue =
    !!careCase?.respondBy &&
    !careCase.clearedAt &&
    new Date(careCase.respondBy).getTime() < Date.now();

  const submit = async () => {
    if (!careCase || !note.trim()) return;
    const result = await onClear(careCase.id, note.trim());
    setError(result);
    if (!result) {
      setNote("");
      onClose();
    }
  };

  return (
    <Sheet open={!!careCase} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{careCase?.studentName ?? "Student"}</SheetTitle>
        </SheetHeader>
        {careCase && (
          <div className="space-y-5 px-4 pb-6 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              {careCase.effectiveTag && (
                <TriageBadge level={careCase.effectiveTag} active />
              )}
              {careCase.clearedAt && (
                <span className="bg-success/10 text-success rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  Cleared
                </span>
              )}
            </div>
            {careCase.tagReason && (
              <p className="text-muted-foreground">{careCase.tagReason}</p>
            )}
            <dl className="grid grid-cols-2 gap-2">
              <dt className="text-muted-foreground">Submitted</dt>
              <dd>{when(careCase.submittedAt)}</dd>
              <dt className="text-muted-foreground">Respond by</dt>
              <dd className={overdue ? "text-destructive font-semibold" : ""}>
                {when(careCase.respondBy)}
                {overdue ? " (overdue)" : ""}
              </dd>
            </dl>

            {run && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold tracking-widest uppercase">
                  Run · {run.kind} · attempt {run.attempt}
                </h3>
                {run.tagReason && <p>{run.tagReason}</p>}
                {run.load !== null && (
                  <p className="text-muted-foreground">
                    Load {run.load}
                    {run.loadMax !== null ? `/${run.loadMax}` : ""}
                    {run.peak !== null ? ` · peak ${run.peak}` : ""}
                    {run.cross ? ` · cross ${run.cross}` : ""}
                  </p>
                )}
                <ul className="divide-border divide-y rounded-xl border">
                  {run.sections.map((s) => (
                    <li
                      key={s.code}
                      className="flex justify-between gap-3 p-2.5"
                    >
                      <span>{s.title}</span>
                      <span className="text-muted-foreground">
                        {s.band}
                        {s.score !== null && s.maxScore !== null
                          ? ` · ${s.score}/${s.maxScore}`
                          : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {clearances.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold tracking-widest uppercase">
                  Clearances
                </h3>
                {clearances.map((c) => (
                  <div key={c.clearedAt} className="rounded-xl border p-2.5">
                    <p className="text-muted-foreground text-xs">
                      {when(c.clearedAt)}
                    </p>
                    <p className="whitespace-pre-wrap">{c.note}</p>
                  </div>
                ))}
              </div>
            )}

            {isStanding911 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold tracking-widest uppercase">
                  Clear this 911
                </h3>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={MAX_NOTE}
                  placeholder="What was done, and why it's safe to clear"
                  className="min-h-24"
                />
                {error?.fieldError("note") ? (
                  <p className="text-destructive">{error.fieldError("note")}</p>
                ) : (
                  <ApiErrorNote error={error} />
                )}
                <LoadingButton
                  onClick={submit}
                  loading={isClearing}
                  disabled={!note.trim()}
                  variant="destructive"
                  className="w-full"
                >
                  Clear 911
                </LoadingButton>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
