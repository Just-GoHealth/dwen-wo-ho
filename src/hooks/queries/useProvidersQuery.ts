import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance, checkResponse } from "@/configs/axiosInstance";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { toast } from "sonner";
import { IProviderResponse } from "@/types/provider.type";

interface Provider {
  id: string;
  email: string;
  fullName: string;
  professionalTitle: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
  lastActive?: string;
}

// API functions
const getProviders = async (): Promise<IProviderResponse> => {
  const response = await axiosInstance.get(ENDPOINTS.providers);
  return checkResponse(response, 200);
};

const getProvider = async (email: string): Promise<Provider> => {
  return api(ENDPOINTS.provider(email));
};

const approveProvider = async (email: string): Promise<Provider> => {
  return api(ENDPOINTS.approveProvider(email), { method: "PUT" });
};

const rejectProvider = async (email: string): Promise<Provider> => {
  return api(ENDPOINTS.rejectProvider(email), { method: "PUT" });
};

const PROVIDERS_QUERY_KEY = "providers";

export const useProvidersQuery = () => {
  const queryClient = useQueryClient();

  // Fetch all providers
  const providersQuery = useQuery({
    queryKey: [PROVIDERS_QUERY_KEY],
    queryFn: () => getProviders(),
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
    isApproving: approveProviderMutation.isPending,
    rejectProvider: rejectProviderMutation.mutate,
    isRejecting: rejectProviderMutation.isPending,
  };
};
