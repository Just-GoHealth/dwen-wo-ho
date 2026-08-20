"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { accessCodesService } from "@/services/curator/competitions/access-codes";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import type {
  AccessCodeStatus,
  MintAccessCodesRequest,
} from "@/lib/types/api/competitions";

const useAccessCodes = (
  teamId: string | number,
  status?: AccessCodeStatus,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: [QUERY_KEYS.competitionAccessCodes, String(teamId), status],
    queryFn: () => accessCodesService.getAccessCodes(teamId, status),
    enabled: (options?.enabled ?? true) && !!teamId,
    staleTime: 60 * 1000,
  });

export default function useAccessCodesQuery() {
  const queryClient = useQueryClient();

  const invalidateTeamCodes = (teamId: string | number) => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.competitionAccessCodes, String(teamId)],
    });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.competitionTeam] });
  };

  const mintMutation = useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: string | number;
      data: MintAccessCodesRequest;
    }) => accessCodesService.mintAccessCodes(teamId, data),
    onSuccess: (result, { teamId }) => {
      invalidateTeamCodes(teamId);
      toast.success(
        `${result.minted} code${result.minted === 1 ? "" : "s"} generated`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate codes");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: ({
      teamId,
      codeId,
      reason,
    }: {
      teamId: string | number;
      codeId: string;
      reason: string;
    }) => accessCodesService.revokeAccessCode(teamId, codeId, reason),
    onSuccess: (_, { teamId }) => {
      invalidateTeamCodes(teamId);
      toast.success("Code revoked");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to revoke code");
    },
  });

  return {
    useAccessCodes,
    mintAccessCodes: mintMutation.mutateAsync,
    isMinting: mintMutation.isPending,
    revokeAccessCode: revokeMutation.mutateAsync,
    isRevoking: revokeMutation.isPending,
    exportAccessCodes: accessCodesService.exportAccessCodes,
  };
}
