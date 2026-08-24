export type AccessCodeStatus = "ISSUED" | "REDEEMED" | "REVOKED";

export interface AccessCode {
  id: string;
  code: string;
  status: AccessCodeStatus;
  seatLabel: string;
  batchId: string;
  issuedAt: string;
  expiresAt: string;
  redeemedByNickname: string | null;
  redeemedAt: string | null;
  revokedAt: string | null;
  revokeReason: string | null;
}

export interface MintAccessCodesRequest {
  count: number;
  seatLabels: string[];
}

export interface MintAccessCodesResponse {
  batchId: string;
  minted: number;
  codes: AccessCode[];
}

export interface RevokeAccessCodeRequest {
  reason: string;
}

export type FixtureOutcome = "PENDING" | "ADVANCED" | "ELIMINATED";

export interface Fixture {
  id: number;
  roundName: string;
  scheduledAt: string;
  timezone: string;
  venue: string;
  status: string;
  outcome: FixtureOutcome;
  ordinal: number;
  whenLabel: string;
  state: string;
}

export interface AddFixtureRequest {
  roundName: string;
  scheduledAt: string;
  timezone: string;
  venue: string;
  ordinal: number;
}

/** One row of a bulk fixture import — keyed by campusId, not teamId, since
 * a version's fixtures are set for many schools at once. */
export interface ImportFixtureRow {
  campusId: number | string;
  roundName: string;
  scheduledAt: string;
  timezone?: string;
  venue?: string;
  ordinal?: number;
}

export interface ImportFixturesRequest {
  replaceExisting: boolean;
  fixtures: ImportFixtureRow[];
}

export interface ImportFixturesResponse {
  imported: number;
  /** Rows naming a campus with no team in this version — never silently
   * dropped, always reported back. */
  skipped: { campusId: number | string; reason?: string }[];
}

export interface RecordFixtureOutcomeRequest {
  outcome: FixtureOutcome;
}

export type TeamStatus = "REGISTERED" | "ACTIVE" | "ELIMINATED" | "CHAMPION";

export interface Team {
  id: number;
  versionCode: string;
  campusId: number | string;
  campusName: string;
  campusLogo: string;
  seatCapacity: number;
  status: TeamStatus;
  coordinatorName: string;
  coordinatorContact: string;
  memberCount: number;
  issuedCodes: number;
  redeemedCodes: number;
  fixtures: Fixture[];
}

export interface RegisterTeamRequest {
  campusId: number | string;
  seatCapacity?: number;
  coordinatorName?: string;
  coordinatorContact?: string;
}

export interface TagSchoolsIntoVersionRequest {
  campusIds: (number | string)[];
}

export interface VersionWindow {
  kind: string;
  label: string;
  heading: string;
  cardLabel: string;
  cardValue: string;
}

export interface Version {
  code: string;
  label: string;
  tagline: string;
  audience: string;
  themeKey: string;
  status: string;
  joinable: boolean;
  startsAt: string | null;
  endsAt: string | null;
  inPeriod: boolean;
  campusTypes: string[];
  windows: VersionWindow[];
  assentText: string;
  assentTextVersion: string;
}

export interface SetVersionPeriodRequest {
  startsAt: string | null;
  endsAt: string | null;
}
