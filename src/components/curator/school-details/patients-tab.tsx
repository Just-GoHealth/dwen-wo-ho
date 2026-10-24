"use client";

import { CheckCheck, Users } from "lucide-react";
import PatientGridCard from "@/components/shared/patient-card/patient-grid-card";
import { PatientsTabProps } from "@/lib/types/components/curator/school-details/school-details";
import { LoadingButton } from "@/components/ui/loading-button";

export function PatientsTab({
  patients,
  isLoading,
  onViewPatient,
  searchQuery = "",
  awaitingCount = 0,
  onAcceptAll,
  isAcceptingAll = false,
}: PatientsTabProps & { searchQuery?: string; schoolId: string }) {
  // TODO(v2-backend): no endpoint deletes result records (v1 DELETE
  // /patient-results/bulk and /patient-results/{id}); bulk select and delete
  // are hidden until one exists. Results can be set inactive instead.

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      patient.patientName?.toLowerCase().includes(query) ||
      patient.visibilityStatus?.toLowerCase().includes(query) ||
      patient.comment?.toLowerCase().includes(query)
    );
  });

  if (filteredPatients.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        <div className="bg-muted mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
          <Users className="text-muted-foreground/50 h-8 w-8" />
        </div>
        <p className="text-foreground font-medium">No patients found</p>
        <p className="text-muted-foreground text-sm">
          Try adjusting your search.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {awaitingCount > 0 && onAcceptAll && (
        <div className="bg-card/60 border-border flex flex-col gap-2 rounded-lg border px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-foreground text-sm font-medium">
            {awaitingCount === 1
              ? "1 result is waiting for you to accept it."
              : `${awaitingCount} results are waiting for you to accept them.`}{" "}
            <span className="text-muted-foreground">
              Providers see a result once it&apos;s accepted.
            </span>
          </p>
          <LoadingButton
            size="sm"
            loading={isAcceptingAll}
            onClick={onAcceptAll}
            className="shrink-0"
          >
            <span className="flex items-center gap-2">
              Accept all <CheckCheck className="size-4" />
            </span>
          </LoadingButton>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filteredPatients.map((patient, index) => (
          <PatientGridCard
            key={patient.patientId}
            index={index}
            patient={patient}
            onActionClick={onViewPatient}
            showCheckbox={false}
          />
        ))}
      </div>
    </div>
  );
}
