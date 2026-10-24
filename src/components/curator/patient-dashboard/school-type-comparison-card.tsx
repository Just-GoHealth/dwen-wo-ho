import { TrendingUp } from "lucide-react";

import type { SchoolTypeComparisonCardProps } from "@/lib/types/components/curator/patient-dashboard";
import { TRIAGE_SECTION } from "@/lib/utils/curator/patient-dashboard/outcome-metrics";

export default function SchoolTypeComparisonCard({
  outcomes,
  benchmarks,
}: SchoolTypeComparisonCardProps) {
  const typeAverages = benchmarks?.campusType;
  if (!typeAverages) return null;

  const rows = outcomes.filter(
    (o) =>
      o.sectionCode !== TRIAGE_SECTION &&
      o.score != null &&
      typeAverages.averages[o.sectionCode]?.average != null,
  );
  if (rows.length === 0) return null;

  return (
    <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
      <div className="border-border bg-muted/20 flex items-center gap-4 border-b px-6 py-4">
        <div className="bg-accent border-border rounded-xl border p-2 shadow-sm">
          <TrendingUp className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h3 className="text-foreground text-lg font-bold tracking-tight">
            School Type Comparison
          </h3>
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            {typeAverages.type} averages
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => {
          const avg = typeAverages.averages[row.sectionCode]!;
          return (
            <div
              key={row.sectionCode}
              className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3"
            >
              <span className="text-muted-foreground text-xs font-bold uppercase">
                {row.sectionTitle}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-foreground text-lg font-bold">
                  {row.score}
                </span>
                <span className="text-muted-foreground text-xs">
                  avg: {avg.average!.toFixed(2)} (n={avg.count})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
