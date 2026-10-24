import { describe, expect, it } from "vitest";
import {
  inferCampusIds,
  tierForResult,
  toPatientCase,
} from "./campus-membership";
import type { JoinRequestView, Notification, ResultItem } from "@/lib/v2/types";

const note = (
  type: string,
  campusId: string,
  createdAt: string,
): Notification => ({
  id: `${type}-${campusId}-${createdAt}`,
  campusId: null,
  type,
  title: "",
  body: "",
  link: null,
  data: { campusId },
  readAt: null,
  createdAt,
});

const join = (
  campusId: string,
  status: JoinRequestView["status"],
  decidedAt: string,
): JoinRequestView => ({
  id: `j-${campusId}`,
  kind: "JOIN_CAMPUS",
  status,
  createdAt: decidedAt,
  decidedAt,
  applicant: null,
  target: { type: "CAMPUS", id: campusId, name: null },
});

describe("inferCampusIds", () => {
  it("replays add/remove in time order", () => {
    const ids = inferCampusIds(
      [
        join("c1", "APPROVED", "2026-01-01T00:00:00Z"),
        join("c9", "DECLINED", "2026-01-01T00:00:00Z"),
      ],
      [
        note("PROVIDER_REMOVED", "c1", "2026-02-01T00:00:00Z"),
        note("PROVIDER_ADDED", "c2", "2026-01-05T00:00:00Z"),
        note("NEW_RESULTS", "c3", "2026-03-01T00:00:00Z"),
      ],
    );

    expect(ids.sort()).toEqual(["c2", "c3"]);
  });

  it("re-adds a campus added again after removal", () => {
    const ids = inferCampusIds(
      [],
      [
        note("PROVIDER_ADDED", "c1", "2026-01-01T00:00:00Z"),
        note("PROVIDER_REMOVED", "c1", "2026-02-01T00:00:00Z"),
        note("PROVIDER_ADDED", "c1", "2026-03-01T00:00:00Z"),
      ],
    );
    expect(ids).toEqual(["c1"]);
  });
});

describe("toPatientCase", () => {
  const item = {
    id: "r1",
    displayName: "Kofi A.",
    createdAt: "2026-10-01T00:00:00Z",
    urgent: false,
    attention: true,
    seen: false,
    lockedIn: { score: 4.5, colour: "RED" },
    urgentReason: null,
    yearLabel: "Form 2",
    respondBy: "2026-10-02T00:00:00Z",
    overdue: true,
  } as ResultItem;

  it("maps a v2 result onto the roll card", () => {
    expect(toPatientCase(item, { id: "c1", name: "Achimota" })).toMatchObject({
      patientResultId: "r1",
      patientName: "Kofi A.",
      score: 4.5,
      status: "new",
      schoolId: "c1",
      schoolName: "Achimota",
      nsmqTag: "NOW",
      overdue: true,
    });
  });

  it("derives the tier from urgent/attention", () => {
    expect(tierForResult({ ...item, urgent: true })).toBe("911");
    expect(tierForResult({ ...item, attention: false })).toBe("ASAP");
  });
});
