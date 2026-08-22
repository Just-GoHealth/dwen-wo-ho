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
   * CONFIRMED ABSENT from the real backend response — checked against the
   * `PatientResultResponse` schema in the OpenAPI spec for this backend
   * (api-docs.json, in the sibling `silverwingg` repo, title "Dwen Wo Ho
   * API"). `GET /v1/patient-results/{resultId}` returns: id, lockinId,
   * schoolId, schoolName, schoolNickname, patientName, patientAge,
   * patientSex, patientLevel, visibilityStatus, starProvider,
   * referredProvider, createdAt, firstOpenedAt, openedByCurrentUser,
   * treatingProviders, lockinScore, comment — no photo/avatar field at all.
   * This is a backend gap, not a frontend naming mismatch: no rename here
   * can make a photo appear until the backend adds a field to this
   * response. Left as an optional field (rather than removed) so the
   * Avatar wiring in patient-header.tsx/patient-detail-top-bar.tsx is
   * ready to work the moment the backend does add one.
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
