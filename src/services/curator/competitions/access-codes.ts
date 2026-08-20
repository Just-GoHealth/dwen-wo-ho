import { api } from "@/lib/api";
import { DYNAMIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";
import {
  AccessCode,
  AccessCodeStatus,
  MintAccessCodesRequest,
  MintAccessCodesResponse,
} from "@/lib/types/api/competitions";
import {
  extractArrayData,
  requireSuccessData,
} from "@/lib/utils/shared/api-result";

export const accessCodesService = {
  getAccessCodes: async (
    teamId: string | number,
    status?: AccessCodeStatus,
  ): Promise<AccessCode[]> => {
    const result = await api(
      DYNAMIC_ENDPOINTS.TEAMS.ACCESS_CODES(teamId, status),
    );
    return extractArrayData<AccessCode>(result);
  },

  mintAccessCodes: async (
    teamId: string | number,
    data: MintAccessCodesRequest,
  ): Promise<MintAccessCodesResponse> => {
    const result = await api(
      DYNAMIC_ENDPOINTS.TEAMS.MINT_ACCESS_CODES(teamId),
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    return requireSuccessData<MintAccessCodesResponse>(
      result,
      "Failed to mint access codes",
    );
  },

  revokeAccessCode: async (
    teamId: string | number,
    codeId: string,
    reason: string,
  ): Promise<AccessCode> => {
    const result = await api(
      DYNAMIC_ENDPOINTS.TEAMS.REVOKE_ACCESS_CODE(teamId, codeId),
      { method: "POST", body: JSON.stringify({ reason }) },
    );
    return requireSuccessData<AccessCode>(result, "Failed to revoke code");
  },

  exportAccessCodes: async (
    teamId: string | number,
    batchId?: string,
  ): Promise<string> => {
    const result = await api(
      DYNAMIC_ENDPOINTS.TEAMS.EXPORT_ACCESS_CODES(teamId, batchId),
    );
    return requireSuccessData<string>(result, "Failed to export access codes");
  },
};
