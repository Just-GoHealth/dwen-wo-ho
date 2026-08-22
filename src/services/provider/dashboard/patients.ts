import { api } from "@/lib/api";
import {
  STATIC_ENDPOINTS,
  DYNAMIC_ENDPOINTS,
} from "@/lib/constants/infra/endpoints";
import type {
  ProviderUpdatePatientStatusRequest,
  ProviderPatientsParams,
} from "@/lib/types/api/provider-dashboard";
import type {
  PatientListResponse,
  UrgentPatientListResponse,
} from "@/lib/types/api/patient-results";

const PD = STATIC_ENDPOINTS.PROVIDER_DASHBOARD;

export const patientsService = {
  getPatients: async (
    params?: ProviderPatientsParams,
  ): Promise<PatientListResponse> => {
    const query = new URLSearchParams();
    if (params?.schoolId) query.set("schoolId", params.schoolId);
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    if (params?.page != null) query.set("page", String(params.page));
    if (params?.limit != null) query.set("limit", String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : "";
    const result = await api(`${PD.PATIENTS}${qs}`);
    if (result?.success && result.data)
      // blind type-cast, no runtime validation — but `PatientCase.avatarUrl`
      // itself is confirmed correct: it's a real field on the `PatientCase`
      // schema in this backend's OpenAPI spec (api-docs.json, sibling
      // `silverwingg` repo). If photos still don't render on the provider
      // dashboard grid, the field name isn't the cause — check whether the
      // backend is actually populating it for patients with a photo on file.
      return result.data as PatientListResponse;
    throw new Error("Failed to fetch provider patients");
  },

  getUrgentPatients: async (): Promise<UrgentPatientListResponse> => {
    const result = await api(PD.PATIENTS_URGENT);
    if (result?.success && result.data) return result.data;
    throw new Error("Failed to fetch urgent patients");
  },

  updatePatientStatus: async (
    patientId: string | number,
    payload: ProviderUpdatePatientStatusRequest,
  ): Promise<void> => {
    await api(DYNAMIC_ENDPOINTS.PROVIDERS.UPDATE_PATIENT_STATUS(patientId), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};
