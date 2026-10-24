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

/** A result on the provider's roll, mapped from a v2 `ResultItem`. */
export interface PatientCase {
  /** The v2 result id (there's no separate patient id on the wire). */
  patientId: string;
  patientResultId: string;
  patientName: string;
  /** Locked-In score (Quick Screen only; 0 for NSMQ runs). */
  score: number;
  /** "new" until a provider opens it, then "seen". */
  status: string;
  schoolId: string;
  schoolName: string;
  time: string;
  preview: string;
  avatarUrl: string | null;
  schoolNickname: string;
  /** Tier from `urgent` / `attention`: 911, NOW, else ASAP. */
  nsmqTag: "911" | "NOW" | "ASAP";
  respondBy: string | null;
  overdue: boolean;
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
