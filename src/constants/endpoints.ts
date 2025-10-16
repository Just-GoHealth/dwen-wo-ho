export const ENDPOINTS = {
  // Auth endpoints
  login: "/api/v1/auth/sign-in",
  signup: "/api/v1/auth/create-account",
  checkEmail: "/api/v1/auth/check-email",
  verifyEmail: "/api/v1/auth/submit-signup-code",
  addPhoto: "/api/v1/auth/add-photo",
  updateProfile: "/api/v1/auth/update-profile",
  addSpecialty: "/api/v1/auth/add-specialty",
  profile: "/api/v1/auth/profile",
  recoverAccount: "/api/v1/auth/recover-account",
  submitAccountRecoveryCode: "/api/v1/auth/submit-account-recovery-code",
  resetPassword: "/api/v1/auth/reset-password",

  // Curator endpoints
  curatorCheckEmail: "/api/v1/auth/curator/check-email",
  curatorSignIn: "/api/v1/auth/curator/sign-in",

  // Specialties endpoints
  specialties: "/api/v1/specialties",

  // Providers endpoints
  providers: "/api/v1/providers",
  provider: (email: string) => `/api/v1/providers/${email}`,
  approveProvider: (email: string) => `/api/v1/providers/${email}/approve`,
  rejectProvider: (email: string) => `/api/v1/providers/${email}/reject`,

  // Schools endpoints
  schools: "/api/v1/schools",
  school: (id: string) => `/api/v1/schools/${id}`,
  disableSchool: (id: string) => `/api/v1/schools/${id}/disable`,
};
