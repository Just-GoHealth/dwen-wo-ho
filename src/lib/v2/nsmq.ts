import { http } from "./http";
import type { CareCase, Clearance, StaffRun, UUID } from "./types";

/** NSMQ runs and care cases for staff (4d). Providers see the tag and reason. */
export const nsmqApi = {
  run: (id: UUID) => http.get<StaffRun>(`/runs/${id}`),
  /** Standing 911s first. */
  careCases: (campusId: UUID) =>
    http.get<CareCase[]>("/care-cases", { query: { campusId } }),
  clearances: (caseId: UUID) =>
    http.get<Clearance[]>(`/care-cases/${caseId}/clearances`),
  /** Only the campus's NSMQ counsellor may clear (others get 403 FORBIDDEN). */
  clear: (caseId: UUID, note: string) =>
    http.post<CareCase>(`/care-cases/${caseId}/clear`, { note }),
};
