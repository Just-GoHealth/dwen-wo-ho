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
      // NOTE: blind type-cast, no runtime validation. In particular,
      // `PatientCase.avatarUrl` is unconfirmed against this endpoint's real
      // response shape (no OpenAPI/swagger spec was found in this repo to
      // verify field names against) — if the backend's actual JSON key
      // differs from `avatarUrl`, this field silently resolves to
      // `undefined` with no visible error, and patient photos won't render
      // on the provider dashboard grid. Verify against a real response
      // before trusting this field.
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
