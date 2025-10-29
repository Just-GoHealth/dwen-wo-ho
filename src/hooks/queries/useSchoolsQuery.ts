import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  axiosFormData,
  axiosInstance,
  checkResponse,
} from "@/configs/axiosInstance";
import { toast } from "sonner";
import { ICreateSchool, School } from "@/types/school";
import { ENDPOINTS } from "@/constants/endpoints";
import { ILockIn } from "@/types/lockin.type";

// API functions
const getSchools = async (): Promise<School[]> => {
  const response = await axiosInstance.get("/api/v1/schools");
  return response.data?.data;
};

const getSchool = async (schoolId: string): Promise<School> => {
  const response = await axiosInstance.get(`/api/v1/schools/${schoolId}`);
  return checkResponse(response, 200)?.data;
};

const getSchoolLockIn = async (schoolId: string): Promise<ILockIn> => {
  const response = await axiosInstance.get(ENDPOINTS.getSchoolLockIn(schoolId));
  return checkResponse(response, 200);
};

const createSchool = async (data: ICreateSchool): Promise<School> => {
  const response = await axiosFormData.post(`/api/v1/schools`, data);
  return checkResponse(response, 201);
};

const disableSchool = async (schoolId: string): Promise<School> => {
  const response = await axiosInstance.put(
    `/api/v1/schools/${schoolId}/disable`
  );
  return response.data?.data;
};

const SCHOOLS_QUERY_KEY = "schools";
const SCHOOLS_LOCKIN_QUERY_KEY = "schools_lockin";

export const useSchoolsQuery = () => {
  const queryClient = useQueryClient();

  // Fetch all schools
  const schoolsQuery = useQuery({
    queryKey: [SCHOOLS_QUERY_KEY],
    queryFn: getSchools,
  });

  // Get single school lockin
  const getSchoolLockinQuery = (schoolId: string) =>
    useQuery({
      queryKey: [SCHOOLS_LOCKIN_QUERY_KEY, schoolId],
      queryFn: () => getSchoolLockIn(schoolId),
      enabled: !!schoolId,
    });

  // Get single school
  const useSchool = (schoolId: string) =>
    useQuery({
      queryKey: [SCHOOLS_QUERY_KEY, schoolId],
      queryFn: () => getSchool(schoolId),
      enabled: !!schoolId,
    });

  // create school mutation
  const createSchoolMutation = useMutation({
    mutationFn: createSchool,
    onSuccess: (success) => {
      console.log(success);
      queryClient.invalidateQueries({ queryKey: [SCHOOLS_QUERY_KEY] });

      toast.success("School created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create school");
    },
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
    getSchoolLockinQuery,
    // Mutations
    createSchoolMutation,
    disableSchool: disableSchoolMutation.mutate,
    isDisabling: disableSchoolMutation.isPending,
  };
};
