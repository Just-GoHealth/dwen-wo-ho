import { api } from "@/lib/api";
import {
  STATIC_ENDPOINTS,
  DYNAMIC_ENDPOINTS,
} from "@/lib/constants/infra/endpoints";
import {
  IProviderResponse,
  Provider,
  ProviderDetails,
  ApiActionResponse,
} from "@/lib/types/entities/provider";

export const listService = {
  getProviders: async (): Promise<IProviderResponse> => {
    const result = await api(STATIC_ENDPOINTS.PROVIDERS.BASE);
    if (result?.success) {
      return {
        success: true,
        data: Array.isArray(result.data) ? result.data : [],
        message: result.message ?? "",
      };
    }
    return { success: false, data: [], message: "Failed to fetch providers" };
  },

  getProvider: async (email: string): Promise<ProviderDetails> => {
    const result = await api(DYNAMIC_ENDPOINTS.PROVIDERS.GET(email));
    if (result?.success && result.data) return result.data as ProviderDetails;
    throw new Error("Failed to fetch provider");
  },

  approveProvider: async (email: string): Promise<ApiActionResponse> => {
    const result = await api(DYNAMIC_ENDPOINTS.PROVIDERS.APPROVE(email), {
      method: "PUT",
    });
    return {
      success: !!result?.success,
      message: result?.message,
      data: result?.data as Provider | undefined,
    };
  },

  rejectProvider: async (email: string): Promise<ApiActionResponse> => {
    const result = await api(DYNAMIC_ENDPOINTS.PROVIDERS.REJECT(email), {
      method: "PUT",
    });
    return {
      success: !!result?.success,
      message: result?.message,
      data: result?.data as Provider | undefined,
    };
  },
};
