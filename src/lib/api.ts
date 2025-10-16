import { axiosInstance, axiosFormData } from "@/configs/axiosInstance";

type WithAuth = { token?: string };

const authHeader = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export const api = {
  // Auth: Email check
  async checkEmail(email: string) {
    const response = await axiosInstance.post("/api/v1/auth/check-email", {
      email,
    });
    return response.data;
  },

  // Auth: Sign in
  async signIn(payload: { email: string; password: string }) {
    const response = await axiosInstance.post("/api/v1/auth/sign-in", payload);
    return response.data;
  },

  // Auth: Create account
  async createAccount(payload: {
    email: string;
    password?: string;
    fullName: string;
    professionalTitle: string;
  }) {
    const response = await axiosInstance.post(
      "/api/v1/auth/create-account",
      payload
    );
    return response.data;
  },

  // Auth: Submit signup code
  async submitSignupCode(payload: { code: string; email: string }) {
    const response = await axiosInstance.post(
      "/api/v1/auth/submit-signup-code",
      payload
    );
    return response.data;
  },

  // Auth: Add photo (multipart/form-data)
  async addPhoto(file: File, opts?: WithAuth) {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axiosFormData.post(
      "/api/v1/auth/add-photo",
      formData,
      {
        headers: {
          ...authHeader(opts?.token),
        },
      }
    );
    return response.data;
  },

  // Auth: Update profile
  async updateProfile(
    payload: { officePhoneNumber: string; status: string },
    opts?: WithAuth
  ) {
    const response = await axiosInstance.post(
      "/api/v1/auth/update-profile",
      payload,
      {
        headers: {
          ...authHeader(opts?.token),
        },
      }
    );
    return response.data;
  },

  // Auth: Add specialty
  async addSpecialty(payload: { specialty: string }, opts?: WithAuth) {
    const response = await axiosInstance.post(
      "/api/v1/auth/add-specialty",
      payload,
      {
        headers: {
          ...authHeader(opts?.token),
        },
      }
    );
    return response.data;
  },

  // Auth: Profile (GET)
  async getProfile(opts?: WithAuth) {
    const response = await axiosInstance.get("/api/v1/auth/profile", {
      headers: {
        ...authHeader(opts?.token),
      },
    });
    return response.data;
  },

  // Auth: Recover account
  async recoverAccount(payload: { email: string }) {
    const response = await axiosInstance.post(
      "/api/v1/auth/recover-account",
      payload
    );
    return response.data;
  },

  // Auth: Submit account recovery code
  async submitAccountRecoveryCode(payload: { code: string; email: string }) {
    const response = await axiosInstance.post(
      "/api/v1/auth/submit-account-recovery-code",
      payload
    );
    return response.data;
  },

  // Auth: Reset password
  async resetPassword(
    payload: { password: string; confirmPassword: string },
    opts?: WithAuth
  ) {
    const response = await axiosInstance.post(
      "/api/v1/auth/reset-password",
      payload,
      {
        headers: {
          ...authHeader(opts?.token),
        },
      }
    );
    return response.data;
  },

  // Specialties: Create
  async createSpecialty(payload: { name: string }) {
    const response = await axiosInstance.post("/api/v1/specialties", payload);
    return response.data;
  },

  // Specialties: List
  async listSpecialties() {
    const response = await axiosInstance.get("/api/v1/specialties");
    return response.data;
  },

  // Curator: Check email
  async curatorCheckEmail(payload: { email: string; password: string }) {
    const response = await axiosInstance.post(
      "/api/v1/auth/curator/check-email",
      payload
    );
    return response.data;
  },

  // Curator: Sign in
  async curatorSignIn(payload: { email: string; password: string }) {
    const response = await axiosInstance.post(
      "/api/v1/auth/curator/sign-in",
      payload
    );
    return response.data;
  },

  // Curator: Get all providers
  async getProviders(opts?: WithAuth) {
    const response = await axiosInstance.get("/api/v1/providers", {
      headers: {
        ...authHeader(opts?.token),
      },
    });
    return response.data;
  },

  // Curator: Get single provider
  async getProvider(email: string, opts?: WithAuth) {
    const response = await axiosInstance.get(`/api/v1/providers/${email}`, {
      headers: {
        ...authHeader(opts?.token),
      },
    });
    return response.data;
  },

  // Curator: Approve provider
  async approveProvider(email: string, opts?: WithAuth) {
    const response = await axiosInstance.put(
      `/api/v1/providers/${email}/approve`,
      {},
      {
        headers: {
          ...authHeader(opts?.token),
        },
      }
    );
    return response.data;
  },

  // Curator: Reject provider
  async rejectProvider(email: string, opts?: WithAuth) {
    const response = await axiosInstance.put(
      `/api/v1/providers/${email}/reject`,
      {},
      {
        headers: {
          ...authHeader(opts?.token),
        },
      }
    );
    return response.data;
  },

  // Schools: Get all schools
  async getSchools(opts?: WithAuth) {
    const response = await axiosInstance.get("/api/v1/schools", {
      headers: {
        ...authHeader(opts?.token),
      },
    });
    return response.data;
  },

  // Schools: Get single school
  async getSchool(schoolId: string, opts?: WithAuth) {
    const response = await axiosInstance.get(`/api/v1/schools/${schoolId}`, {
      headers: {
        ...authHeader(opts?.token),
      },
    });
    return response.data;
  },

  // Schools: Disable school
  async disableSchool(schoolId: string, opts?: WithAuth) {
    const response = await axiosInstance.put(
      `/api/v1/schools/${schoolId}/disable`,
      {},
      {
        headers: {
          ...authHeader(opts?.token),
        },
      }
    );
    return response.data;
  },
};

export type Api = typeof api;
