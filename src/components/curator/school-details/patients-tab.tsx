"use client";

import { Trash, Users } from "lucide-react";
import PatientGridCard from "@/components/shared/patient-card/patient-grid-card";
import { PatientsTabProps } from "@/lib/types/components/curator/school-details/school-details";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useDeleteBulkPatientRecords } from "@/hooks/curator/delete-patient-records/use-delete-patient-records";

export function PatientsTab({
  patients,
  isLoading,
  onViewPatient,
  searchQuery = "",
  schoolId,
}: PatientsTabProps & { searchQuery?: string; schoolId: string }) {
  const { bulkDeletePending, deleteBulkPatients } =
    useDeleteBulkPatientRecords(schoolId);
  const [selectedPatients, setSelectedPatients] = useState<
    Set<number | string>
  >(new Set([]));
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const handleBulkDeleteConfirm = () => {
    deleteBulkPatients(selectedPatients, () => {
      setSelectedPatients(new Set());
      setShowBulkDeleteModal(false);
    });
  };

  const selectAll = selectedPatients.size === patients.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPatients(new Set(patients.map((p) => p.id)));
    } else {
      setSelectedPatients(new Set());
    }
  };

  const handleSelectPatient = (id: string | number, checked: boolean) => {
    const newSelected = new Set(selectedPatients);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedPatients(newSelected);
  };

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
          Try adjusting your search or add a new patient.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p>Select all</p>
          <Checkbox
            id="select-all-checkbox"
            name="select-all-checkbox"
            checked={selectAll}
            onCheckedChange={handleSelectAll}
            className="bg-background border-primary"
          />
        </div>
        <LoadingButton
          variant="destructive"
          loading={bulkDeletePending}
          disabled={selectedPatients.size < 1}
          onClick={() => setShowBulkDeleteModal(true)}
        >
          <div className="flex items-center justify-center gap-2">
            Delete <Trash className="size-4 text-white" />
          </div>
        </LoadingButton>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filteredPatients.map((patient, index) => (
          <PatientGridCard
            key={patient.id}
            index={index}
            patient={patient}
            onActionClick={onViewPatient}
            showCheckbox
            selected={selectedPatients.has(patient.id)}
            onToggleSelect={handleSelectPatient}
          />
        ))}
      </div>

      <ConfirmationModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete Patient Records"
        message={`This will permanently delete ${selectedPatients.size} patient record${selectedPatients.size > 1 ? "s" : ""}. This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={bulkDeletePending}
      />
    </div>
  );
}
