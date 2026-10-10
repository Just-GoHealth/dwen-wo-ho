import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { patientsService } from "@/services/shared/patients";
import { lockinsService } from "@/services/shared/lock-ins";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";

// Hoisted query hooks — they close over no component state.
const usePatientFullDetails = (
  patientId: string,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: [QUERY_KEYS.patientResult, "full-details", patientId],
    queryFn: () => patientsService.getFullPatientDetails(patientId),
    enabled: (options?.enabled ?? true) && !!patientId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

const useAvailableProvidersForReferral = (
  resultId: string | number,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: [
      QUERY_KEYS.patientResult,
      "available-providers",
      String(resultId),
    ],
    queryFn: () => patientsService.getAvailableProvidersForReferral(resultId),
    enabled: (options?.enabled ?? false) && !!resultId,
    staleTime: 2 * 60 * 1000,
  });

const usePatientActions = (
  resultId: string | number,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: [QUERY_KEYS.patientResult, "actions", String(resultId)],
    queryFn: () => patientsService.getPatientActions(resultId),
    enabled: (options?.enabled ?? true) && !!resultId,
    staleTime: 2 * 60 * 1000,
  });

export default function usePatientResultQuery() {
  const queryClient = useQueryClient();

  const createPatientResultMutation = useMutation({
    mutationFn: patientsService.createPatientResult,
    onSuccess: (_, { schoolId }) => {
      // Invalidate school students and patient results list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.schools, "students", String(schoolId)],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.patientResult] });
      toast.success("Patient result created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create patient result");
    },
  });

  const updateActionStatusMutation = useMutation({
    mutationFn: ({
      resultId,
      data,
    }: {
      resultId: string | number;
      data: { providerId: string | number; actionStatus: string };
    }) => patientsService.updateActionStatus(resultId, data),
    onSuccess: (_, { resultId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.patientResult, "full-details", String(resultId)],
      });
      toast.success("Action status updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update action status");
    },
  });

  const openPatientResultMutation = useMutation({
    mutationFn: (resultId: string | number) =>
      patientsService.openPatientResult(resultId),
    onSuccess: (_, resultId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.patientResult, "full-details", String(resultId)],
      });
    },
    onError: () => {
      /* silent — opening is a background effect */
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({
      lockinId,
      comment,
    }: {
      lockinId: string | number;
      comment: string;
    }) => lockinsService.addComment(lockinId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.patientResult],
      });
      toast.success("Comment saved");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save comment");
    },
  });

  const setReferredProviderMutation = useMutation({
    mutationFn: ({
      resultId,
      providerId,
    }: {
      resultId: string | number;
      providerId: string;
    }) => patientsService.setReferredProvider(resultId, providerId),
    onSuccess: (_, { resultId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.patientResult, "full-details", String(resultId)],
      });
      toast.success("Referral set successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to set referral");
    },
  });

  const addPatientActionMutation = useMutation({
    mutationFn: ({
      resultId,
      data,
    }: {
      resultId: string | number;
      data: { title: string; type: string; notes?: string };
    }) => patientsService.addPatientAction(resultId, data),
    onSuccess: (_, { resultId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.patientResult, "actions", String(resultId)],
      });
      toast.success("Action added");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add action");
    },
  });

  return {
    usePatientFullDetails,
    createPatientResult: createPatientResultMutation.mutateAsync,
    isCreating: createPatientResultMutation.isPending,
    updateActionStatus: updateActionStatusMutation.mutateAsync,
    isUpdating: updateActionStatusMutation.isPending,
    openPatientResult: openPatientResultMutation.mutate,
    addComment: addCommentMutation.mutateAsync,
    isAddingComment: addCommentMutation.isPending,
    useAvailableProvidersForReferral,
    setReferredProvider: setReferredProviderMutation.mutateAsync,
    isSettingReferral: setReferredProviderMutation.isPending,
    usePatientActions,
    addPatientAction: addPatientActionMutation.mutateAsync,
    isAddingAction: addPatientActionMutation.isPending,
  };
}
