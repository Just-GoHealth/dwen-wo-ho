import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/configs/axiosInstance";
import { toast } from "sonner";
import { School } from "@/types/school";

// API functions
const getSchools = async (): Promise<School[]> => {
  const response = await axiosInstance.get("/api/v1/schools");
  return response.data;
};

const getSchool = async (schoolId: string): Promise<School> => {
  const response = await axiosInstance.get(`/api/v1/schools/${schoolId}`);
  return response.data;
};

const disableSchool = async (schoolId: string): Promise<School> => {
  const response = await axiosInstance.put(
    `/api/v1/schools/${schoolId}/disable`
  );
  return response.data;
};

const SCHOOLS_QUERY_KEY = "schools";

export const useSchools = () => {
  const queryClient = useQueryClient();

  // Fetch all schools
  const schoolsQuery = useQuery({
    queryKey: [SCHOOLS_QUERY_KEY],
    queryFn: getSchools,
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
