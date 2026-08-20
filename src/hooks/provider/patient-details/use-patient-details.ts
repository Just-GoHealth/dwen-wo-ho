"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import useUserQuery from "@/hooks/queries/use-user-profile";
import usePatientResultQuery from "@/hooks/queries/use-patient-result";
import { getColorHex } from "@/lib/utils/shared/color-hex";
import { PatientActionResponseDTO } from "@/lib/types/api/patient-results";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";

const EMPTY_HISTORY_ACTIONS: PatientActionResponseDTO[] = [];

/** Shown in place of real categories when a patient has no lock-in
 * assessment yet (`lockinId: null` from the backend) — the dome tiles
 * should still render so the screen isn't blank, just with a "no data"
 * placeholder instead of a real score/description. */
const NO_DATA_METRICS: MetricCategory[] = [
  {
    name: "General Mental Health",
    description: "No data yet",
    score: "—",
    color: "var(--sw-red-deep)",
    items: [],
  },
  {
    name: "Exam Anxiety",
    description: "No data yet",
    score: "—",
    color: "var(--sw-red-deep)",
    items: [],
  },
  {
    name: "Exam Prep",
    description: "No data yet",
    score: "—",
    color: "var(--sw-red-deep)",
    items: [],
  },
];

export type ActionTab = "pending" | "history";

export interface MetricItem {
  name: string;
  description: string;
  value: string;
  color: string;
}

export interface MetricCategory {
  name: string;
  description: string;
  score: string;
  color: string;
  items: MetricItem[];
}

export function useProviderPatientDetails() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.resultId as string;
  const queryClient = useQueryClient();

  const { getProfileQuery } = useUserQuery();
  const providerId = getProfileQuery.data?.id || getProfileQuery.data?.email;

  const [activeTab, setActiveTab] = useState<ActionTab>("pending");
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);

  // Shared hooks (also used by the generic patient-result query layer) so
  // this screen and any other caller of the same resultId hit the same
  // React Query cache entry instead of two disjoint ones under different
  // keys, and so the actions fetch runs in parallel with patient details
  // rather than artificially waiting on it — it doesn't use patientData's
  // value, only resultId, so there's no real dependency between them.
  const {
    usePatientFullDetails,
    usePatientActions,
    addPatientAction: addPatientActionMutate,
    isAddingAction,
    updateActionStatus,
    isUpdating,
  } = usePatientResultQuery();

  const { data: patientData, isLoading: isPatientLoading } =
    usePatientFullDetails(resultId, {
      enabled: !!resultId && !!getProfileQuery.data,
    });

  const patientResult = patientData?.patientResult ?? null;
  const lockInAssessment = patientData?.lockInAssessment ?? null;

  const { data: allActions = [], isLoading: isActionsLoading } =
    usePatientActions(resultId, { enabled: !!resultId });

  // Filter actions for provider's own actions only
  const actions = useMemo(() => {
    if (!providerId) return [];
    return allActions.filter(
      (action: PatientActionResponseDTO) =>
        action.providerId === providerId || action.createdBy === providerId,
    );
  }, [allActions, providerId]);

  // For now, all actions are shown as pending (type doesn't have status field)
  const pendingActions = actions;
  const historyActions = EMPTY_HISTORY_ACTIONS;

  const addPatientAction = useCallback(
    async (data: { title: string; type: string; notes?: string }) => {
      const result = await addPatientActionMutate({ resultId, data });
      setIsAddActionOpen(false);
      return result;
    },
    [addPatientActionMutate, resultId],
  );

  // Compute metrics categories (same as curator)
  const metrics = useMemo<MetricCategory[]>(() => {
    if (!lockInAssessment) return NO_DATA_METRICS;
    return [
      {
        name: "General Mental Health",
        description: lockInAssessment.generalMentalHealth,
        score: lockInAssessment.generalMentalHealthScore,
        color: getColorHex(lockInAssessment.generalMentalHealthColor),
        items: [
          {
            name: "Depression",
            description: lockInAssessment.possibleDepressionDescription,
            value: lockInAssessment.possibleDepressionScore,
            color: getColorHex(lockInAssessment.possibleDepressionColor),
          },
          {
            name: "Loneliness",
            description: lockInAssessment.lonelinessScoreDescription,
            value: lockInAssessment.lonelinessScore,
            color: getColorHex(lockInAssessment.lonelinessColor),
          },
          {
            name: "Suicidal Risk",
            description: lockInAssessment.suicidalRiskScoreDescription,
            value: lockInAssessment.suicidalRiskScore,
            color: getColorHex(lockInAssessment.suicidalRiskColor),
          },
        ],
      },
      {
        name: "Exam Anxiety",
        description: lockInAssessment.examAnxiety,
        score: lockInAssessment.examAnxietyScore,
        color: getColorHex(lockInAssessment.examAnxietyColor),
        items: [
          {
            name: "Physical Distress",
            description: lockInAssessment.physicalDistressScoreDescription,
            value: lockInAssessment.physicalDistressScore,
            color: getColorHex(lockInAssessment.physicalDistressColor),
          },
          {
            name: "Core Anxiety",
            description: lockInAssessment.coreAnxietyScoreDescription,
            value: lockInAssessment.coreAnxietyScore,
            color: getColorHex(lockInAssessment.coreAnxietyColor),
          },
        ],
      },
      {
        name: "Exam Prep",
        description: lockInAssessment.examPrep,
        score: lockInAssessment.examPrepScore,
        color: getColorHex(lockInAssessment.examPrepColor),
        items: [
          {
            name: "Motivation",
            description: lockInAssessment.motivationScoreDescription,
            value: lockInAssessment.motivationScore,
            color: getColorHex(lockInAssessment.motivationColor),
          },
          {
            name: "Procrastination",
            description: lockInAssessment.procrastinationScoreDescription,
            value: lockInAssessment.procrastinationScore,
            color: getColorHex(lockInAssessment.procrastinationColor),
          },
          {
            name: "Study Skills",
            description: lockInAssessment.studySkillsScoreDescription,
            value: lockInAssessment.studySkillsScore,
            color: getColorHex(lockInAssessment.studySkillsColor),
          },
        ],
      },
    ];
  }, [lockInAssessment]);

  // Check if provider is treating this patient
  const isTreating = useMemo(() => {
    if (!patientResult || !providerId) return false;
    return patientResult.treatingProviders.some(
      (p: { id: string | number }) =>
        String(p.id) === String(providerId) || p.id === providerId,
    );
  }, [patientResult, providerId]);

  // Check if another provider is already treating (exclusive mode)
  const isAnotherProviderTreating = useMemo(() => {
    if (!patientResult || !providerId) return false;
    return patientResult.treatingProviders.some(
      (p: { id: string | number }) =>
        String(p.id) !== String(providerId) && p.id !== providerId,
    );
  }, [patientResult, providerId]);

  // Get the treating provider name (if another is treating)
  const treatingProviderName = useMemo(() => {
    if (!patientResult || !providerId) return null;
    const otherProvider = patientResult.treatingProviders.find(
      (p: { id: string | number; fullName?: string }) =>
        String(p.id) !== String(providerId) && p.id !== providerId,
    );
    return otherProvider?.fullName || null;
  }, [patientResult, providerId]);

  const handleUpdateActionStatus = useCallback(
    async (actionStatus: "TREATING" | "NOT_TREATING") => {
      if (!patientResult || !providerId) return;
      await updateActionStatus({
        resultId,
        data: { providerId, actionStatus },
      });
    },
    [patientResult, providerId, resultId, updateActionStatus],
  );

  // Refresh data helper
  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.patientResult, "full-details", resultId],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.patientResult, "actions", String(resultId)],
    });
  }, [queryClient, resultId]);

  return {
    // Navigation
    router,
    resultId,

    // Patient data
    patientResult,
    lockInAssessment,
    isLoading: isPatientLoading,
    refreshData,

    // Metrics
    metrics,

    // Actions
    activeTab,
    setActiveTab,
    pendingActions,
    historyActions,
    isActionsLoading,
    addPatientAction,
    isAddingAction,
    isAddActionOpen,
    setIsAddActionOpen,

    // Treatment status
    isTreating,
    isAnotherProviderTreating,
    treatingProviderName,
    handleUpdateActionStatus,
    isUpdating,
    providerId,
  };
}
