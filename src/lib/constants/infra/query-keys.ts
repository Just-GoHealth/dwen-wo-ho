export const QUERY_KEYS = {
  partners: "partners",
  schools: "schools",
  providers: "providers",
  lockins: "lockins",
  schoolsLockin: "schools-lockin",
  patientResults: "patientResults",
  patientResult: "patient-result",
  auth: "auth",
  user: "user",
  profile: "profile",
  specialties: "specialties",
  campuses: "campuses",
  programmes: "programmes",
  tags: "tags",
  curator: "curator",
  curatorSummary: "curator-summary",
  curatorNotifications: "curator-notifications",
  providerSchoolsSummary: "provider-schools-summary",
  providerDashboard: "provider-dashboard",
  curatorProviderDetails: "curator-provider-details",
  curatorPatientModal: "curator-patient-modal",
  curatorPatientDetails: "curator-patient-details",
  schoolDetail: "school-detail",
  schoolPatients: (schoolId: string) =>
    [QUERY_KEYS.schoolDetail, "patients", schoolId] as const,
  schoolProviders: (schoolId: string) =>
    [QUERY_KEYS.schoolDetail, "providers", schoolId] as const,
  schoolUrgentCare: (schoolId: string) =>
    [QUERY_KEYS.schoolDetail, "urgent-care", schoolId] as const,
  schoolPatientsOverview: (schoolId: string) =>
    [QUERY_KEYS.schoolDetail, "patients-overview", schoolId] as const,
} as const;
