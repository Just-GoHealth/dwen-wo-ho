import type {
  JoinRequestView,
  Notification,
  ResultItem,
  UUID,
} from "@/lib/v2/types";
import type { PatientCase } from "@/lib/types/api/patient-results";

/**
 * Backend gap: there is no "my campuses" endpoint for providers yet
 * (provider-app.md, "Not available yet"). Until there is, the campuses a
 * provider serves are inferred from what the API does tell them, replayed in
 * time order:
 * - an APPROVED JOIN_CAMPUS request attaches them;
 * - PROVIDER_ADDED / PROVIDER_REMOVED notifications attach / detach them;
 * - NEW_RESULTS / URGENT_RESULT / RESULT_OVERDUE prove they were attached.
 * Callers then drop any campus whose results answer 404 (no longer attached).
 */
export function inferCampusIds(
  joinRequests: JoinRequestView[],
  notifications: Notification[],
): UUID[] {
  type Event = { at: string; campusId: string; attach: boolean };
  const events: Event[] = [];

  for (const request of joinRequests) {
    if (
      request.kind === "JOIN_CAMPUS" &&
      request.status === "APPROVED" &&
      request.target?.type === "CAMPUS"
    ) {
      events.push({
        at: request.decidedAt ?? request.createdAt,
        campusId: request.target.id,
        attach: true,
      });
    }
  }

  for (const n of notifications) {
    const campusId = n.data?.campusId;
    if (typeof campusId !== "string" || !campusId) continue;
    if (n.type === "PROVIDER_REMOVED") {
      events.push({ at: n.createdAt, campusId, attach: false });
    } else if (
      n.type === "PROVIDER_ADDED" ||
      n.type === "NEW_RESULTS" ||
      n.type === "URGENT_RESULT" ||
      n.type === "RESULT_OVERDUE"
    ) {
      events.push({ at: n.createdAt, campusId, attach: true });
    }
  }

  events.sort((a, b) => a.at.localeCompare(b.at));
  const attached = new Set<string>();
  for (const e of events) {
    if (e.attach) attached.add(e.campusId);
    else attached.delete(e.campusId);
  }
  return [...attached];
}

/** Triage tier from the result's flags: urgent → 911, attention → NOW. */
export const tierForResult = (item: ResultItem): "911" | "NOW" | "ASAP" =>
  item.urgent ? "911" : item.attention ? "NOW" : "ASAP";

/** Maps a v2 result onto the roll's card model. */
export function toPatientCase(
  item: ResultItem,
  campus: { id: string; name: string; nickname?: string },
): PatientCase {
  return {
    patientId: item.id,
    patientResultId: item.id,
    patientName: item.displayName,
    score: item.lockedIn?.score ?? 0,
    status: item.seen ? "seen" : "new",
    schoolId: campus.id,
    schoolName: campus.name,
    schoolNickname: campus.nickname ?? "",
    time: item.createdAt,
    preview: item.urgentReason ?? item.yearLabel ?? "",
    avatarUrl: null,
    nsmqTag: tierForResult(item),
    respondBy: item.respondBy,
    overdue: item.overdue,
  };
}
