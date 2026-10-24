import { FileText } from "lucide-react";

import type { AssessmentDetailsCardProps } from "@/lib/types/components/curator/patient-dashboard";

const SOURCE_LABELS = {
  QUICK_SCREEN: "Quick Screen",
  TRIAGE_RUN: "NSMQ triage run",
} as const;

export default function AssessmentDetailsCard({
  detail,
}: AssessmentDetailsCardProps) {
  const { result } = detail;

  return (
    <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
      <div className="border-border bg-muted/20 flex items-center gap-4 border-b px-6 py-4">
        <div className="bg-accent border-border rounded-xl border p-2 shadow-sm">
          <FileText className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h3 className="text-foreground text-lg font-bold tracking-tight">
            Assessment Details
          </h3>
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            {SOURCE_LABELS[detail.source]}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
            Taken
          </p>
          <p className="text-foreground text-sm font-medium">
            {new Date(result.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
            Variant
          </p>
          <p className="text-foreground text-sm font-medium">
            {result.variant ?? "N/A"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
            Status
          </p>
          <p className="text-foreground text-sm font-medium">
            {result.active ? "Active" : "Inactive"}
            {result.seen ? " · Seen" : ""}
          </p>
        </div>
        {result.suicidality && (
          <div>
            <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
              Suicidality
            </p>
            <p className="text-foreground text-sm font-medium">
              {result.suicidality}
            </p>
          </div>
        )}
        {result.lastProviderView && (
          <div className="sm:col-span-2">
            <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
              Last opened by a provider
            </p>
            <p className="text-foreground text-sm font-medium">
              {result.lastProviderView.name},{" "}
              {new Date(result.lastProviderView.at).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
