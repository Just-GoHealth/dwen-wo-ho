import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  axiosFormData,
  axiosInstance,
  checkResponse,
} from "@/configs/axiosInstance";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ICreateSchool, School } from "@/types/school";
import { ENDPOINTS } from "@/constants/endpoints";
import { ILockIn } from "@/types/lockin.type";

// API functions
const getSchools = async (): Promise<School[]> => {
  const result = await api("/api/v1/schools");
  return result.data;
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
  const result = await api(`/api/v1/schools/${schoolId}/disable`, {
    method: "PUT",
  });
  return result.data;
};

const SCHOOLS_QUERY_KEY = "schools";
const SCHOOLS_LOCKIN_QUERY_KEY = "schools_lockin";

export const useSchools = () => {
  return useQuery({
    queryKey: [SCHOOLS_QUERY_KEY],
    queryFn: getSchools,
  });
};

export const useSchool = (schoolId: string) => {
  return useQuery({
    queryKey: [SCHOOLS_QUERY_KEY, schoolId],
    queryFn: () => getSchool(schoolId),
    enabled: !!schoolId,
  });
};

export const useSchoolLockin = (schoolId: string) => {
  return useQuery({
    queryKey: [SCHOOLS_LOCKIN_QUERY_KEY, schoolId],
    queryFn: () => getSchoolLockIn(schoolId),
    enabled: !!schoolId,
  });
};

export const useCreateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
};

export const useDisableSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disableSchool,
    onSuccess: (data, schoolId) => {
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
};

// Deprecated default export for backward compatibility relative to file name,
// but functionally distinct. Ideally we remove this but I'll leave it as a proxy if needed
// or just remove it to force errors. I will remove it to be clean.
