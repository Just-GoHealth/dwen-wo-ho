/** Audit history, newest first (AuditController). Curator only. */
import { buildQuery, http } from "@/lib/v2/http";
import type { ISOInstant, Page, PageParams, UUID } from "./types";

/** AuditEventView */
export interface AuditEvent {
  id: UUID;
  occurredAt: ISOInstant;
  actorAccountId: UUID | null;
  /** e.g. "CAMPUS_CREATED", "FIXTURE_OUTCOME". */
  action: string;
  entityType: string;
  entityId: string;
  campusId: UUID | null;
  summary: string;
  /** JSON text of the field changes, or null. */
  changes: string | null;
}

export interface AuditParams extends PageParams {
  entityType?: string;
  entityId?: string;
  campusId?: UUID;
  from?: ISOInstant;
  to?: ISOInstant;
}

export const auditCurator = {
  list: (params: AuditParams = {}) =>
    http.get<Page<AuditEvent>>(`/audit${buildQuery({ ...params })}`),
};
