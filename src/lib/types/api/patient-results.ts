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
