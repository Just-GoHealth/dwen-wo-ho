import type { TreatingProviderDTO } from "../api/common";

export interface PatientResult {
  id: number;
  lockinId: number;
  schoolId: number;
  schoolName: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  patientLevel: string;
  visibilityStatus: "NEW" | "SEEN";
  starProvider: {
    id: string;
    fullName: string;
    email: string;
    professionalTitle: string;
    specialty: string;
  } | null;
  referredProvider: {
    id: string;
    fullName: string;
    email: string;
    professionalTitle: string;
    specialty: string;
  } | null;
  createdAt: string;
  firstOpenedAt: string | null;
  openedByCurrentUser: boolean;
  treatingProviders: Array<{
    id: string;
    fullName: string;
  }>;
  // Optional fields for list views
  comment?: string | null;
  lockinScore: number;
  /**
   * Patient's profile photo, if one exists. Field name is NOT confirmed
   * against a real API spec for `GET /v1/patient-results/{resultId}` — no
   * OpenAPI/swagger doc was found in this repo. Chosen by convention: the
   * codebase's photo-upload responses use `profilePhotoUrl`/`profilePhotoURL`
   * (e.g. `AddPhotoResponse`, `SchoolProvider.profilePhotoURL`) while list
   * entities use `avatarUrl` (e.g. `PatientCase`, `ProviderProfileData`);
   * `photoUrl` was picked as the best-evidence guess. Verify against the
   * real backend response and rename if it differs.
   */
  photoUrl?: string;
}

export interface UrgentPatient {
  id: string | number;
  patientResultId: string | number;
  patientName: string;
  schoolId: number;
  schoolName: string;
  schoolNickname: string;
  time: string;
  lockedInScore: string;
  score: string;
  avatarUrl?: string;
  urgentCareEnteredAt?: string;
}

export interface UrgentCarePatient {
  id: number;
  lockinId?: number;
  schoolId?: number;
  patientResultId?: number;
  patientName: string;
  patientAge?: number;
  patientSex?: string;
  lockedInScore?: number;
  lockinDate?: string;
  urgentCareEnteredAt?: string;
  createdAt?: string;
  isTreating?: boolean;
  treatingProviders?: TreatingProviderDTO[];
}
