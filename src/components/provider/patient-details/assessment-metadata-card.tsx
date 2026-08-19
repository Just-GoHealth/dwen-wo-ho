"use client";

import { FileText } from "lucide-react";
import { m } from "motion/react";
import { LockInAssessment } from "@/lib/types/entities/lockin";

interface AssessmentMetadataCardProps {
  lockInAssessment: LockInAssessment;
}

export function AssessmentMetadataCard({
  lockInAssessment,
}: AssessmentMetadataCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border-border overflow-hidden rounded-2xl border shadow-sm"
    >
      <div className="border-border bg-muted/20 flex items-center gap-4 border-b px-6 py-4">
        <div className="bg-accent border-border rounded-xl border p-2 shadow-sm">
          <FileText className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h3 className="text-foreground text-lg font-bold tracking-tight">
            Assessment Details
          </h3>
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Lock-in Information
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
            Lock-in ID
          </p>
          <p className="text-foreground text-sm font-medium">
            #{lockInAssessment?.lockinId}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
            Assessment Date
          </p>
          <p className="text-foreground text-sm font-medium">
            {lockInAssessment?.lockinDate
              ? new Date(lockInAssessment.lockinDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
            School Type
          </p>
          <p className="text-foreground text-sm font-medium">
            {lockInAssessment?.schoolType}
          </p>
        </div>
        {lockInAssessment?.comment && (
          <div className="sm:col-span-3">
            <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
              Comment
            </p>
            <p className="text-foreground bg-muted/30 rounded-lg p-3 text-sm">
              {lockInAssessment.comment}
            </p>
          </div>
        )}
      </div>
    </m.div>
  );
}
