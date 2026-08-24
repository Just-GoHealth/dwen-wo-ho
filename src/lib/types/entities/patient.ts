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
  profilePhotoURL?: string | null;
  // server-decided triage tag - never recompute this client-side (see
  // deriveTriageTier in triage.ts, which is only a fallback for data that
  // doesn't have this field yet)
  nsmqTag?: "911" | "NOW" | "ASAP" | null;
  nsmqReasonCode?: string | null;
  nsmqResponseDueAt?: string | null;
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
