import { api } from "@/lib/api";
import { DYNAMIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";
import { LockInData } from "@/lib/types/entities/lockin";
import { LockinUpdateResponse } from "@/lib/types/api/lockin";

// Lock-in (screening) data as seen by providers and curators. Moved out of
// services/patient when the patient-facing section was removed (item 3).
export const lockinsService = {
  getSchoolLockIn: async (schoolId: string | number): Promise<LockInData> => {
    const response = await api(DYNAMIC_ENDPOINTS.SCHOOLS.GET_LOCKIN(schoolId));
    if (response?.success && response.data) {
      return response.data as LockInData;
    }
    throw new Error("Failed to fetch school lock-in data");
  },

  getLockInUpdate: async (
    lockinId: string | number,
  ): Promise<LockinUpdateResponse> => {
    const response = await api(DYNAMIC_ENDPOINTS.LOCKIN.GET_UPDATE(lockinId));
    if (response?.success && response.data) {
      return response.data as LockinUpdateResponse;
    }
    throw new Error("Failed to fetch lock-in update");
  },

  addComment: async (
    lockinId: string | number,
    comment: string,
  ): Promise<void> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.LOCKIN.UPDATE_COMMENT(lockinId),
      {
        method: "PATCH",
        body: JSON.stringify({ comment }),
      },
    );
    if (!response?.success) throw new Error("Failed to save comment");
  },
};
