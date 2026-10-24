/**
 * NSMQ, curator side: versions, teams, access codes and fixtures (ContestController).
 * Reading versions is public; everything else needs the CURATOR role.
 *
 * Curator-only codes: NAME_TAKEN (version code), TEAM_HAS_MEMBERS (untag),
 * CAPACITY_REACHED (mint), CODES_EXCEED_CAPACITY (seat capacity), STALE (version, fixture).
 */
import { ApiError, http } from "@/lib/v2/http";
import { seg } from "./files";
import type { ISOInstant, TeamStatus, UUID, VersionStatus } from "./types";

/** ContestService.VersionView */
export interface VersionView {
  code: string;
  label: string;
  description: string | null;
  status: VersionStatus;
  joinable: boolean;
  startsAt: ISOInstant | null;
  endsAt: ISOInstant | null;
  d1Hours: number;
  t3Hours: number;
  assentText: string | null;
  assentVersion: number;
  campusTypes: string[];
  version: number;
}

/** ContestController.VersionRequest */
export interface VersionRequest {
  /** `[A-Za-z0-9_-]{2,40}` */
  code: string;
  label: string;
  description?: string | null;
  status: VersionStatus;
  startsAt?: ISOInstant | null;
  endsAt?: ISOInstant | null;
  /** 1–168 */
  d1Hours?: number | null;
  /** 1–48 */
  t3Hours?: number | null;
  assentText?: string | null;
  campusTypes?: string[] | null;
}

/** ContestController.VersionPatch: only the fields being changed, plus `version`. */
export interface VersionPatch {
  version: number;
  label?: string;
  description?: string;
  status?: VersionStatus;
  startsAt?: ISOInstant;
  endsAt?: ISOInstant;
  d1Hours?: number;
  t3Hours?: number;
  /** Changing the wording makes students re-accept before their next run. */
  assentText?: string;
  campusTypes?: string[];
}

/** ContestService.TeamView */
export interface TeamView {
  id: UUID;
  campusId: UUID;
  campusName: string;
  status: TeamStatus;
  coordinatorName: string | null;
  coordinatorContact: string | null;
  seatCapacity: number | null;
  members: number;
  nextKickoff: ISOInstant | null;
}

/** ContestService.TagReport: ineligible, unknown or already-tagged campuses are skipped. */
export interface TagReport {
  added: TeamView[];
  skipped: { campusId: string; reason: string }[];
}

export type TeamBoard = Record<TeamStatus, TeamView[]>;

/** ContestController.TeamPatch: null/omitted fields are left as they are. */
export interface TeamPatch {
  /** ELIMINATED records an elimination; ACTIVE reinstates. */
  status?: TeamStatus;
  coordinatorName?: string;
  coordinatorContact?: string;
  seatCapacity?: number;
}

export type CodeStatus = "ISSUED" | "REDEEMED" | "REVOKED" | "EXPIRED";

/** ContestService.CodeView */
export interface CodeView {
  id: UUID;
  code: string;
  seatLabel: string | null;
  batchId: UUID;
  status: CodeStatus;
  expiresAt: ISOInstant | null;
  redeemedAt: ISOInstant | null;
}

/** ContestController.MintRequest */
export interface MintRequest {
  /** 1–200 per batch. */
  count: number;
  seatLabels?: string[] | null;
}

export const MAX_CODES_PER_BATCH = 200;

export type FixtureStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
export type FixtureOutcome = "PENDING" | "ADVANCED" | "ELIMINATED";

/** ContestService.FixtureView */
export interface FixtureView {
  id: UUID;
  teamId: UUID;
  roundName: string;
  kickoffAt: ISOInstant;
  timezone: string | null;
  venue: string | null;
  position: number;
  status: FixtureStatus;
  outcome: FixtureOutcome;
  version: number;
}

/** ContestController.FixtureRequest */
export interface FixtureRequest {
  roundName: string;
  kickoffAt: ISOInstant;
  /** IANA zone, e.g. "Africa/Accra". */
  timezone?: string | null;
  venue?: string | null;
  position?: number | null;
}

/** ContestController.FixturePatch */
export interface FixturePatch {
  version: number;
  roundName?: string;
  kickoffAt?: ISOInstant;
  timezone?: string;
  venue?: string;
  position?: number;
}

/** ContestController.ImportRequest: one row of a bulk import; all or nothing. */
export interface ImportRow {
  campusId: UUID;
  roundName: string;
  kickoffAt: ISOInstant;
  timezone?: string | null;
  venue?: string | null;
}

export const nsmqCurator = {
  // Versions
  versions: () => http.get<VersionView[]>("/versions"),
  version: (code: string) => http.get<VersionView>(`/versions/${seg(code)}`),
  createVersion: (body: VersionRequest) =>
    http.post<VersionView>("/versions", body),
  updateVersion: (code: string, body: VersionPatch) =>
    http.patch<VersionView>(`/versions/${seg(code)}`, body),

  // Teams
  teams: (code: string) => http.get<TeamView[]>(`/versions/${seg(code)}/teams`),
  board: (code: string) => http.get<TeamBoard>(`/versions/${seg(code)}/board`),
  tagTeams: (code: string, campusIds: UUID[]) =>
    http.post<TagReport>(`/versions/${seg(code)}/teams`, { campusIds }),
  /** 409 TEAM_HAS_MEMBERS once students have joined. */
  untagTeam: (code: string, campusId: UUID) =>
    http.delete<void>(`/versions/${seg(code)}/teams/${seg(campusId)}`),
  updateTeam: (teamId: UUID, body: TeamPatch) =>
    http.patch<TeamView>(`/teams/${seg(teamId)}`, body),

  // Access codes
  codes: (teamId: UUID) => http.get<CodeView[]>(`/teams/${seg(teamId)}/codes`),
  /** 422 CAPACITY_REACHED past the team's seat capacity. Returns the new batch. */
  mintCodes: (teamId: UUID, body: MintRequest) =>
    http.post<CodeView[]>(`/teams/${seg(teamId)}/codes`, body),
  /** The team's unused codes as CSV text (seat,code,expires,school,version). */
  exportCodes: async (teamId: UUID): Promise<string> => {
    const res = await fetch(`/teams/${seg(teamId)}/codes/export`, {
      credentials: "include",
      headers: { Accept: "text/csv" },
    });
    if (!res.ok) {
      let problem: { status: number; code?: string; detail?: string } = {
        status: res.status,
      };
      try {
        problem = { ...(await res.json()), status: res.status };
      } catch {
        // Non-JSON error body.
      }
      throw new ApiError(problem);
    }
    return res.text();
  },
  /** Only an unused (ISSUED) code can be revoked; otherwise 400 VALIDATION on `code`. */
  revokeCode: (codeId: UUID, reason?: string | null) =>
    http.post<CodeView>(`/codes/${seg(codeId)}/revoke`, {
      reason: reason ?? null,
    }),

  // Fixtures
  fixtures: (teamId: UUID) =>
    http.get<FixtureView[]>(`/teams/${seg(teamId)}/fixtures`),
  createFixture: (teamId: UUID, body: FixtureRequest) =>
    http.post<FixtureView>(`/teams/${seg(teamId)}/fixtures`, body),
  updateFixture: (fixtureId: UUID, body: FixturePatch) =>
    http.patch<FixtureView>(`/fixtures/${seg(fixtureId)}`, body),
  /** ELIMINATED eliminates the team and opens T+; PENDING reverts. */
  setOutcome: (fixtureId: UUID, outcome: FixtureOutcome) =>
    http.put<FixtureView>(`/fixtures/${seg(fixtureId)}/outcome`, { outcome }),
  cancelFixture: (fixtureId: UUID) =>
    http.post<FixtureView>(`/fixtures/${seg(fixtureId)}/cancel`),
  /** For fixtures entered in error; a real cancellation keeps its history. */
  deleteFixture: (fixtureId: UUID) =>
    http.delete<void>(`/fixtures/${seg(fixtureId)}`),
  importFixtures: (code: string, rows: ImportRow[]) =>
    http.post<FixtureView[]>(`/versions/${seg(code)}/fixtures/import`, rows),
};
