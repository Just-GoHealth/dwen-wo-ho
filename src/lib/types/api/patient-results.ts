import type { UrgentPatient } from "@/lib/types/entities/patient";

export interface PatientActionResponseDTO {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  date?: string;
  notes?: string;
  createdAt: string;
  providerId?: string;
  createdBy?: string;
}

export interface PatientListResponse {
  patients: PatientCase[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}
export interface UrgentPatientListResponse {
  urgentPatients: UrgentPatient[];
  urgentPatientsCount: number;
}

export interface PatientCase {
  patientId: number;
  // confirmed real field on this schema (api-docs.json) but was missing
  // from this frontend type entirely — needed to cross-reference a list
  // entry back to a specific /patients/[resultId] detail page
  patientResultId: number;
  patientName: string;
  score: number;
  status: string;
  schoolId: number;
  schoolName: string;
  time: string;
  preview: string;
  avatarUrl: string | null;
  schoolNickname: string;
}

export interface BoardRowResponse {
  itemCode?: string;
  name?: string;
  label?: string;
  severity?: "mild" | "mod" | "sev";
}

export interface BoardSectionResponse {
  key?: string;
  title?: string;
  time?: string;
  score?: number;
  max?: number;
  band?: string;
  fam?: "green" | "gold" | "red" | "emg";
  emergency?: boolean;
  items?: BoardRowResponse[];
  level?: string;
  carried?: boolean;
  sourceScreeningId?: string;
}

// GET /v1/patient-results/{resultId}/board — the same screening board the
// patient's own app renders (see just-go-patient's ScreeningBoard type),
// now exposed to provider/curator. 404 ("no screening board recorded") is
// the expected response for a patient who hasn't gone through the newer
// screening system yet, not an error.
export interface BoardResponse {
  screeningId?: string;
  run?: string;
  label?: string;
  head?: string;
  at?: string;
  school?: string;
  sections?: BoardSectionResponse[];
  emergency?: boolean;
  careAcknowledged?: boolean;
  publicStatus?: string;
  tool?: "D1" | "T3" | "TPLUS";
  tag?: "911" | "NOW" | "ASAP";
  reasonCode?: string;
  reason?: string;
  load?: number;
  peak?: number;
  cross?: number | null;
  carriedContextMissing?: boolean;
}
