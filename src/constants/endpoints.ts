export const ENDPOINTS = {
  // Auth endpoints
  login: "/api/v1/auth/sign-in",
  signup: "/api/v1/auth/create-account",
  checkEmail: "/api/v1/auth/check-email",
  sendVerificationEmail: "/api/v1/email/send-verification",
  verifyEmail: "/api/v1/auth/submit-signup-code",
  addPhoto: "/api/v1/auth/add-photo",
  updateProfile: "/api/v1/auth/update-profile",
  addSpecialty: "/api/v1/auth/add-speciality",
  profile: "/api/v1/auth/profile",
  recoverAccount: "/api/v1/auth/recover-account",
  submitAccountRecoveryCode: "/api/v1/auth/submit-account-recovery-code",
  resetPassword: "/api/v1/auth/reset-password",

  // Specialties endpoints
  specialties: "/api/v1/specialties",

  // Providers endpoints
  providers: "/api/v1/providers",
  provider: (email: string) => `/api/v1/providers/${email}`,
  approveProvider: (email: string) => `/api/v1/providers/${email}/approve`,
  rejectProvider: (email: string) => `/api/v1/providers/${email}/reject`,
  addSchoolToProvider: (email: string) => `/api/v1/providers/${email}/add-school`,
  removeSchoolFromProvider: (email: string) => `/api/v1/providers/${email}/remove-school`,
  addPartnerToProvider: (email: string) => `/api/v1/providers/${email}/add-partner`,
  removePartnerFromProvider: (email: string) => `/api/v1/providers/${email}/remove-partner`,

  // Schools endpoints
  schools: "/api/v1/schools",
  school: (id: string | number) => `/api/v1/schools/${id}`,
  updateSchool: (id: string | number) => `/api/v1/schools/${id}`,
  schoolPartners: (id: string | number) => `/api/v1/schools/${id}/partners`,
  schoolProviders: (id: string | number) => `/api/v1/schools/${id}/providers`,
  schoolReach: (id: string | number) => `/api/v1/schools/${id}/reach`,
  getSchoolLockIn: (id: string) => `/api/v1/lockin/${id}`,
  disableSchool: (id: string | number) => `/api/v1/schools/${id}/disable`,
};
