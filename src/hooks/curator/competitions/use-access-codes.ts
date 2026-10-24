"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import {
  nsmqCurator,
  type CodeStatus,
  type MintRequest,
} from "@/lib/v2/curator/nsmq";
import type { UUID } from "@/lib/v2/curator/types";
import { toastCuratorError } from "@/lib/v2/curator/errors";

const codesKey = (teamId: UUID) => [QUERY_KEYS.competitionAccessCodes, teamId];

// v2 lists every code; the status tab filters on the client.
const useAccessCodes = (
  teamId: UUID,
  status?: CodeStatus,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: codesKey(teamId),
    queryFn: () => nsmqCurator.codes(teamId),
    select: (codes) =>
      status ? codes.filter((c) => c.status === status) : codes,
    enabled: (options?.enabled ?? true) && !!teamId,
    staleTime: 60 * 1000,
  });

export default function useAccessCodesQuery() {
  const queryClient = useQueryClient();

  const invalidateTeamCodes = (teamId: UUID) => {
    queryClient.invalidateQueries({ queryKey: codesKey(teamId) });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.competitionTeam] });
  };

  const mintMutation = useMutation({
    mutationFn: ({ teamId, data }: { teamId: UUID; data: MintRequest }) =>
      nsmqCurator.mintCodes(teamId, data),
    onSuccess: (codes, { teamId }) => {
      invalidateTeamCodes(teamId);
      toast.success(
        `${codes.length} code${codes.length === 1 ? "" : "s"} generated`,
      );
    },
    // 422 CAPACITY_REACHED past the team's seat capacity.
    onError: (error) => {
      toastCuratorError(error, { fallback: "Failed to generate codes" });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: ({
      codeId,
      reason,
    }: {
      teamId: UUID;
      codeId: UUID;
      reason?: string;
    }) => nsmqCurator.revokeCode(codeId, reason || null),
    onSuccess: (_, { teamId }) => {
      invalidateTeamCodes(teamId);
      toast.success("Code revoked");
    },
    onError: (error, { teamId }) => {
      // Only an unused code can be revoked; refresh in case it was just redeemed.
      invalidateTeamCodes(teamId);
      toastCuratorError(error, { fallback: "Failed to revoke code" });
    },
  });

  return {
    useAccessCodes,
    mintAccessCodes: mintMutation.mutateAsync,
    isMinting: mintMutation.isPending,
    revokeAccessCode: revokeMutation.mutateAsync,
    isRevoking: revokeMutation.isPending,
    exportAccessCodes: nsmqCurator.exportCodes,
  };
}
