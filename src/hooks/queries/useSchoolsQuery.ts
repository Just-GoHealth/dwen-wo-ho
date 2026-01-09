import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  axiosFormData,
  axiosInstance,
  checkResponse,
} from "@/configs/axiosInstance";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ICreateSchool, IUpdateSchool, School } from "@/types/school";
import { ENDPOINTS } from "@/constants/endpoints";
import { ILockIn } from "@/types/lockin.type";

const getSchools = async (): Promise<School[]> => {
  const result = await api(`/api/v1/schools`);

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
  const result = await api(`/api/v1/schools/${schoolId}/disable`, {
    method: "PUT",
  });
  
  if (result?.success && result.data) {
    return result.data;
  }
  
  throw new Error("Failed to disable school");
};

const createSchool = async (data: ICreateSchool): Promise<School> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("nickname", data.nickname);
  formData.append("type", data.type);
  formData.append("baseline", data.baseline);
  formData.append("campuses", JSON.stringify(data.campuses));
  
  if (data.logo) {
    formData.append("logo", data.logo);
  }

  const response = await axiosFormData.post(ENDPOINTS.schools, formData);
  return checkResponse(response, 201);
};

const updateSchool = async (data: IUpdateSchool): Promise<School> => {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.nickname !== undefined) formData.append("nickname", data.nickname);
  if (data.type !== undefined) formData.append("type", data.type);
  if (data.baseline !== undefined) formData.append("baseline", data.baseline);
  if (data.campuses !== undefined) formData.append("campuses", JSON.stringify(data.campuses));
  if (data.logo) formData.append("logo", data.logo);

  // const response = await axiosFormData.put(ENDPOINTS.updateSchool(data.id), formData);
  const response = await axiosFormData.post(ENDPOINTS.updateSchool(data.id), formData);
  return checkResponse(response, 200);
};

const SCHOOLS_QUERY_KEY = "schools";
const SCHOOLS_LOCKIN_QUERY_KEY = "schools_lockin";

export const useSchools = () => {
  return useQuery({
    queryKey: [SCHOOLS_QUERY_KEY],
    queryFn: () => getSchools(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSchool = (schoolId: string) => {
  return useQuery({
    queryKey: [SCHOOLS_QUERY_KEY, schoolId],
    queryFn: () => getSchool(schoolId),
    enabled: !!schoolId,
  });
};

const getSchoolLockIn = async (schoolId: string) => {
  const result = await api(ENDPOINTS.getSchoolLockIn(schoolId));
  
  if (result?.success && result.data) {
    return result.data;
  }
  
  throw new Error("Failed to fetch school lockin");
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
    onSuccess: () => {
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

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSchool,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [SCHOOLS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [SCHOOLS_QUERY_KEY, String(variables.id)],
      });
      toast.success("School updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update school");
    },
  });
};
