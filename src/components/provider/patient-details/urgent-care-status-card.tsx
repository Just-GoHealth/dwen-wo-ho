"use client";

import { Stethoscope } from "lucide-react";
import { m } from "motion/react";
import { LockInAssessment } from "@/lib/types/entities/lockin";

interface UrgentCareStatusCardProps {
  lockInAssessment: LockInAssessment;
}

export function UrgentCareStatusCard({
  lockInAssessment,
}: UrgentCareStatusCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card border-border overflow-hidden rounded-2xl border shadow-sm"
    >
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
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${
              lockInAssessment?.inUrgentCare
                ? "animate-pulse bg-red-500"
                : "bg-green-500"
            }`}
          />
          <span className="text-foreground font-medium">
            {lockInAssessment?.inUrgentCare
              ? "In Urgent Care"
              : "Not in Urgent Care"}
          </span>
        </div>
        {lockInAssessment?.inUrgentCare && (
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
                Entered At
              </p>
              <p className="text-foreground">
                {lockInAssessment.urgentCareEnteredAt
                  ? new Date(
                      lockInAssessment.urgentCareEnteredAt,
                    ).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
                Time in Care
              </p>
              <p className="text-foreground">
                {lockInAssessment.timeInUrgentCareMinutes
                  ? `${Math.floor(lockInAssessment.timeInUrgentCareMinutes / 60)}h ${lockInAssessment.timeInUrgentCareMinutes % 60}m`
                  : "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </m.div>
  );
}
