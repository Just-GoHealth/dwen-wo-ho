export const ROUTES = {
  public: {
    landing: "/",
    joinAsProvider: "/join-as-provider",
    about: "/about",
    privacyPolicy: "/privacy-policy",
    termsAndConditions: "/terms-and-conditions",
    cookiePolicy: "/cookie-policy",
  },
  provider: {
    application: "/provider/application",
    auth: "/provider/auth",
    signIn: "/provider/auth?step=sign-in",
    signUp: "/provider/signup",
    resetPassword: "/provider/auth?step=reset-password",
    newPassword: "/provider/new-password",
    profile: "/provider/profile",
    home: "/provider",
    schools: "/provider/schools",
    patients: "/provider/patients",
  },
  patient: {
    join: "/patient/join",
    resetPassword: "/patient/reset-password",
    resetPasswordNew: "/patient/reset-password/new",
    lockIn: "/patient/lock-in",
    waitingRoom: "/patient/waiting-room",
    profile: "/patient/profile",
  },
  curator: {
    dashboard: "/curator",
    create: "/curator/create",
    schools: "/curator/schools",
    providers: "/curator/providers",
    partners: "/curator/partners",
    providerDetails: "/curator/provider",
    pages: "/curator/pages",
    competitions: "/curator/competitions",
  },
} as const;

export const DYNAMIC_ROUTES = {
  curator: {
    createFlow: (type: "campus" | "provider" | "programme" | "tag", step = 1) =>
      `/curator/create/${type}?step=${step}`,
    schoolDetails: (schoolId: string | number) =>
      `/curator/schools/${schoolId}`,
    patientDetails: (schoolId: string | number, patientId: string | number) =>
      `/curator/schools/${schoolId}/patients/${patientId}`,
    competitionDetails: (versionCode: string) =>
      `/curator/competitions/${versionCode}`,
    teamDetails: (versionCode: string, teamId: string | number) =>
      `/curator/competitions/${versionCode}/teams/${teamId}`,
  },
  provider: {
    schoolDetails: (schoolId: string | number) =>
      `/provider/schools/${schoolId}`,
    patientDetails: (patientId: string | number) =>
      `/provider/patients/${patientId}`,
  },
} as const;
