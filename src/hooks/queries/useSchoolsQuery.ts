import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { School } from "@/types/school";

// API functions
const getSchools = async (type?: string): Promise<School[]> => {
  const params = new URLSearchParams();
  if (type) params.append("type", type);
  
  const result = await api(`/api/v1/schools?${params.toString()}`);

  console.log({result})
  return result || [];
};

const getSchool = async (schoolId: string): Promise<School> => {
  const result = await api(`/api/v1/schools/${schoolId}`);

  console.log({result})
  return result.data;
};

const disableSchool = async (schoolId: string): Promise<School> => {
  const result = await api(`/api/v1/schools/${schoolId}/disable`, {
    method: "PUT",
  });
  return result.data;
};

const SCHOOLS_QUERY_KEY = "schools";

export const useSchoolsQuery = (type?: string) => {
  const queryClient = useQueryClient();

  // Fetch all schools
  const schoolsQuery = useQuery({
    queryKey: [SCHOOLS_QUERY_KEY, type],
    queryFn: () => getSchools(type),
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

  console.log("schoolsList", schoolsQuery?.data);

  // Return all queries and mutations
  return {
    // Queries
    schools: schoolsQuery.data,
    isLoading: schoolsQuery.isPending,
    isError: schoolsQuery.isError,
    error: schoolsQuery.error,
    // Single school query helper
    useSchool,
    // Mutations
    disableSchool: disableSchoolMutation.mutate,
    isDisabling: disableSchoolMutation.isPending,
  };
};
