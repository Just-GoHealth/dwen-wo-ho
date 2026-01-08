import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { School } from "@/types/school";

const SCHOOLS_QUERY_KEY = "schools";

const getSchools = async (): Promise<School[]> => {
  const result = await api("/api/v1/schools");
  
  if (result?.success && Array.isArray(result.data)) {
    return result.data;
  }
  
  if (Array.isArray(result)) {
    return result;
  }
  
  return [];
};

const getSchool = async (schoolId: string): Promise<School> => {
  const result = await api(`/api/v1/schools/${schoolId}`);
  
  if (result?.success && result.data) {
    return result.data;
  }
  
  throw new Error("Failed to fetch school");
};

const disableSchool = async (schoolId: string): Promise<School> => {
  const result = await api(`/api/v1/schools/${schoolId}/disable`, { method: "PUT" });
  
  if (result?.success && result.data) {
    return result.data;
  }
  
  throw new Error("Failed to disable school");
};

export const useSchools = () => {
  const queryClient = useQueryClient();

  const schoolsQuery = useQuery({
    queryKey: [SCHOOLS_QUERY_KEY],
    queryFn: getSchools,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Get single school
  const useSchool = (schoolId: string) =>
    useQuery({
      queryKey: [SCHOOLS_QUERY_KEY, schoolId],
      queryFn: () => getSchool(schoolId),
      enabled: !!schoolId,
    });

  // Disable school mutation
  const disableSchoolMutation = useMutation({
    mutationFn: disableSchool,
    onSuccess: (data, schoolId) => {
      // Invalidate schools queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: [SCHOOLS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [SCHOOLS_QUERY_KEY, schoolId],
      });

      toast.success("School disabled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to disable school");
    },
  });

  // Return all queries and mutations
  return {
    // Queries
    schools: schoolsQuery.data,
    isLoading: schoolsQuery.isLoading,
    isError: schoolsQuery.isError,
    error: schoolsQuery.error,
    // Single school query helper
    useSchool,
    // Mutations
    disableSchool: disableSchoolMutation.mutate,
    isDisabling: disableSchoolMutation.isPending,
  };
};
