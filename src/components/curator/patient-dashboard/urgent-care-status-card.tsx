import { Stethoscope } from "lucide-react";

import { triageOutcome } from "@/lib/utils/curator/patient-dashboard/outcome-metrics";
import type { UrgentCareStatusCardProps } from "@/lib/types/components/curator/patient-dashboard";

export default function UrgentCareStatusCard({
  detail,
}: UrgentCareStatusCardProps) {
  const { result, care } = detail;
  const triage = triageOutcome(detail.outcomes);
  const needsCare = result.urgent || result.attention;

  return (
    <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
      <div className="border-border bg-muted/20 flex items-center gap-4 border-b px-6 py-4">
        <div className="bg-accent border-border rounded-xl border p-2 shadow-sm">
          <Stethoscope className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h3 className="text-foreground text-lg font-bold tracking-tight">
            Urgent Care Status
          </h3>
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Care Monitoring
          </p>
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${
              result.urgent
                ? "animate-pulse bg-red-500"
                : needsCare
                  ? "bg-amber-500"
                  : "bg-green-500"
            }`}
          />
          <span className="text-foreground font-medium">
            {result.urgent
              ? "Needs urgent care"
              : result.attention
                ? "Needs attention"
                : "No urgent care needed"}
          </span>
          {triage && (
            <span className="bg-muted text-foreground rounded-full px-2 py-0.5 text-xs font-bold">
              {triage.band}
            </span>
          )}
        </div>

        {result.urgentReason && (
          <p className="text-muted-foreground text-sm">{result.urgentReason}</p>
        )}

        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          {result.respondBy && (
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
                Respond by
              </p>
              <p
                className={
                  result.overdue
                    ? "text-destructive font-bold"
                    : "text-foreground"
                }
              >
                {new Date(result.respondBy).toLocaleString()}
                {result.overdue ? " (overdue)" : ""}
              </p>
            </div>
          )}
          {result.treatingStartedAt && (
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
                Treatment started
              </p>
              <p className="text-foreground">
                {new Date(result.treatingStartedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {care.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-bold uppercase">
              Providers on this case
            </p>
            <ul className="space-y-1 text-sm">
              {care.map((c) => (
                <li
                  key={`${c.providerId}-${c.at}`}
                  className="flex flex-wrap items-center justify-between gap-2"
                >
                  <span className="text-foreground font-medium">
                    {c.name ?? "Provider"}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {c.status === "TREATING" ? "Treating" : "Referred"} ·{" "}
                    {new Date(c.at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
