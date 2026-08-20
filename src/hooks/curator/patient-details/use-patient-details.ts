"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import usePatientResultQuery from "@/hooks/queries/use-patient-result";
import { useDeleteSinglePatientRecord } from "@/hooks/curator/delete-patient-records/use-delete-patient-records";
import { buildPatientLockinMetrics } from "@/lib/utils/curator/patient-dashboard/lockin-metrics";

export function useCuratorPatientDetails() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  const schoolId = params.schoolId as string;

  const [activeTab, setActiveTab] = useState<"assessment" | "history">(
    "assessment",
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { deleteSinglePatient, singleDeletePending } =
    useDeleteSinglePatientRecord(schoolId);

  // Shared with the generic patient-result layer (also used by the
  // provider-side detail page) so this screen hits the same cache entry
  // instead of a disjoint one under its own key. The actions fetch only
  // needs patientId, not the full-details result, so it runs in parallel
  // rather than waiting on it.
  const { usePatientFullDetails, usePatientActions, addPatientAction, isAddingAction } =
    usePatientResultQuery();
  const { data, isLoading } = usePatientFullDetails(patientId, {
    enabled: !!patientId,
  });

  const patientResult = data?.patientResult ?? null;
  const lockInAssessment = data?.lockInAssessment ?? null;

  const actionsQuery = usePatientActions(patientId, {
    enabled: !!patientId,
  });
  const actions = actionsQuery.data ?? [];

  const metrics = buildPatientLockinMetrics(lockInAssessment);

  const handleDeleteConfirm = () => {
    deleteSinglePatient(patientId, {
      onSuccess: () => {
        setShowDeleteModal(false);
        router.back();
      },
    });
  };

  return {
    router,
    patientResult,
    lockInAssessment,
    isLoading,
    activeTab,
    setActiveTab,
    metrics,
    actions,
    isActionsLoading: actionsQuery.isLoading,
    addPatientAction,
    isAddingAction,
    showDeleteModal,
    setShowDeleteModal,
    singleDeletePending,
    handleDeleteConfirm,
  };
}
