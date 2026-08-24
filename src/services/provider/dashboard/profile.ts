import { api } from "@/lib/api";
import { STATIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";
import type {
  ProviderDashboardInitResponse,
  ProviderUpdateProfileRequest,
  ProviderProfileData,
} from "@/lib/types/api/provider-dashboard";

const PD = STATIC_ENDPOINTS.PROVIDER_DASHBOARD;

export const profileService = {
  getDashboardInit: async (): Promise<ProviderDashboardInitResponse> => {
    const result = await api(PD.DASHBOARD_INIT);
    if (result?.success && result.data)
      return result.data as ProviderDashboardInitResponse;
    throw new Error("Failed to fetch provider dashboard");
  },

  getProfile: async (): Promise<ProviderProfileData> => {
    const result = await api(PD.PROFILE);
    if (result?.success && result.data)
      return result.data as ProviderProfileData;
    throw new Error("Failed to fetch provider profile");
  },

  updateProfile: async (
    payload: ProviderUpdateProfileRequest,
  ): Promise<ProviderProfileData> => {
    const result = await api(PD.PROFILE, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    if (result?.success && result.data)
      return result.data as ProviderProfileData;
    throw new Error("Failed to update provider profile");
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api(PD.AVATAR, {
      method: "POST",
      body: formData,
    });
    if (response?.success && response.data)
      return response.data as { avatarUrl: string };
    throw new Error("Failed to upload avatar");
  },

  updatePhoneNumber: async (payload: {
    officePhoneNumber: string;
    status: string;
  }): Promise<ProviderProfileData> => {
    let phone = payload.officePhoneNumber.trim();
    const hasPlus = phone.startsWith("+");
    phone = phone.replace(/\D/g, "");
    if (hasPlus) phone = "+" + phone;

    if (phone.startsWith("0") && phone.length === 10) {
      phone = "+233" + phone.substring(1);
    }
    if (phone.startsWith("00233")) {
      phone = "+233" + phone.substring(5);
    }

    const result = await api(STATIC_ENDPOINTS.AUTH.UPDATE_PROFILE, {
      method: "POST",
      body: JSON.stringify({
        officePhoneNumber: phone,
        status: payload.status,
      }),
    });
    if (result?.success && result.data)
      return result.data as ProviderProfileData;
    throw new Error("Failed to update provider profile");
  },
};
