import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance, checkResponse } from "@/configs/axiosInstance";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { toast } from "sonner";
import { IProviderResponse } from "@/types/provider.type";

export interface Provider {
  id: string;
  email: string;
  providerName: string;
  profilePhotoURL?:string;
  specialty: string;
  applicationStatus: "PENDING" | "APPROVED" | "REJECTED";
  applicationDate: string;
  lastActive?: string;
}

const getProviders = async (): Promise<IProviderResponse> => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.providers);
    const data = checkResponse(response, 200);
    
    if (data && typeof data === "object" && "data" in data) {
      return data as IProviderResponse;
    }
    
    if (Array.isArray(data)) {
      return {
        success: true,
        data,
        message: "",
      };
    }
    
    return {
      success: true,
      data: [],
      message: "",
    };
  } catch {
    const result = await api(ENDPOINTS.providers);
    if (result?.success) {
      return {
        success: true,
        data: Array.isArray(result.data) ? result.data : [],
        message: result.message ?? "",
      };
    }
    return {
      success: false,
      data: [],
      message: "Failed to fetch providers",
    };
  }
};

const getProvider = async (email: string): Promise<Provider> => {
  const result = await api(ENDPOINTS.provider(email));
  
  if (result?.success && result.data) {
    return result.data;
  }
  
  throw new Error("Failed to fetch provider");
};

const approveProvider = async (email: string): Promise<Provider> => {
  const result = await api(ENDPOINTS.approveProvider(email), { method: "PUT" });
  
  if (result?.success && result.data) {
    return result.data;
  }
  
  throw new Error("Failed to approve provider");
};

const rejectProvider = async (email: string): Promise<Provider> => {
  const result = await api(ENDPOINTS.rejectProvider(email), { method: "PUT" });
  
  if (result?.success && result.data) {
    return result.data;
  }
  
  throw new Error("Failed to reject provider");
};

const PROVIDERS_QUERY_KEY = "providers";

export const useProvidersQuery = () => {
  const queryClient = useQueryClient();

  const providersQuery = useQuery({
    queryKey: [PROVIDERS_QUERY_KEY],
    queryFn: getProviders,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Get single provider
  const useProvider = (email: string) =>
    useQuery({
      queryKey: [PROVIDERS_QUERY_KEY, email],
      queryFn: () => getProvider(email),
      enabled: !!email,
    });

  // Approve provider mutation
  const approveProviderMutation = useMutation({
    mutationFn: approveProvider,
    onSuccess: (data, email) => {
      // Invalidate providers queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: [PROVIDERS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [PROVIDERS_QUERY_KEY, email],
      });

      toast.success("Provider approved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve provider");
    },
  });

  // Reject provider mutation
  const rejectProviderMutation = useMutation({
    mutationFn: rejectProvider,
    onSuccess: (data, email) => {
      // Invalidate providers queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: [PROVIDERS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [PROVIDERS_QUERY_KEY, email],
      });

      toast.success("Provider rejected successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject provider");
    },
  });

  // Return all queries and mutations
  return {
    // Queries
    providers: providersQuery.data,
    isLoading: providersQuery.isLoading,
    isError: providersQuery.isError,
    error: providersQuery.error,
    // Single provider query helper
    useProvider,
    // Mutations
    approveProvider: approveProviderMutation.mutate,
    rejectProvider: rejectProviderMutation.mutate,
    isModerating: approveProviderMutation.isPending || rejectProviderMutation.isPending,
  };
};
