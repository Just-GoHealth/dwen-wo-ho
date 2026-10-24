"use client";

import { TriageBadge } from "@just-gohealth/ui";
import { Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ResultCareView, ResultItem, Tag } from "@/lib/v2/types";

const formatDue = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });

/**
 * One line of result state under the domes: triage tag (NSMQ), response
 * deadline (`respondBy`, red when `overdue`), who else is on it, and the
 * Active / Inactive switch.
 */
export function ResultStatusBar({
  result,
  tag,
  otherCare,
  onToggleActive,
  isUpdatingActive,
}: {
  result: ResultItem;
  tag: Tag | null;
  otherCare: ResultCareView[];
  onToggleActive: (active: boolean) => void;
  isUpdatingActive: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-2 px-4 text-xs">
      {tag && <TriageBadge level={tag} active />}
      {result.respondBy && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold",
            result.overdue
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-border text-muted-foreground",
          )}
        >
          {result.overdue ? (
            <AlertTriangle className="size-3.5" />
          ) : (
            <Clock className="size-3.5" />
          )}
          {result.overdue ? "Overdue since" : "Respond by"}{" "}
          {formatDue(result.respondBy)}
        </span>
      )}
      {otherCare.map((c) => (
        <span
          key={c.providerId}
          className="border-border text-muted-foreground rounded-full border px-3 py-1"
        >
          {c.name ?? "Another provider"}{" "}
          {c.status === "TREATING" ? "is treating" : "was referred"}
        </span>
      ))}
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isUpdatingActive}
        onClick={() => onToggleActive(!result.active)}
        className="rounded-full"
      >
        {result.active ? "Mark inactive" : "Mark active"}
      </Button>
    </div>
  );
}
