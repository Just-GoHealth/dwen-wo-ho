/**
 * Backend v2 contract types shared by the provider and curator surfaces.
 * Copied from V2-API-CONTRACT.md (sections 1, 2 and 4): JSON keys are the Java
 * record component names, nulls are sent as `null`, instants are ISO-8601 UTC.
 */

export type UUID = string;
export type ISOInstant = string;
export type ISODate = string;

// ---------- Errors ----------
export type CommonCode =
  | "VALIDATION"
  | "MALFORMED_REQUEST"
  | "NOT_SIGNED_IN"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "STALE"
  | "NAME_TAKEN"
  | "CONFLICT"
  | "CONTENT_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "RATE_LIMITED"
  | "SYSTEM";
export type IdentityCode =
  | "CONTACT_IN_USE"
  | "INCORRECT_PASSWORD"
  | "CODE_INCORRECT"
  | "CODE_EXPIRED"
  | "CODE_LOCKED"
  | "GRANT_EXPIRED"
  | "ALREADY_CLAIMED";
export type PatientCode =
  | "NICKNAME_TAKEN"
  | "CAMPUS_LOCKED"
  | "STEP_NOT_READY"
  | "ONBOARDING_INCOMPLETE";
export type MediaCode =
  "IMAGE_UNSUPPORTED" | "IMAGE_TOO_LARGE" | "IMAGE_UNREADABLE";
export type NsmqCode =
  | "VERSION_CLOSED"
  | "CAMPUS_NOT_ELIGIBLE"
  | "CODE_INVALID"
  | "ALREADY_ON_TEAM"
  | "ASSENT_REQUIRED"
  | "NOT_ON_TEAM"
  | "NOTHING_DUE"
  | "RUN_CLOSED"
  | "RUN_SUBMITTED"
  | "ANSWERS_MISSING"
  | "NOT_A_STANDING_911"
  | "TEAM_HAS_MEMBERS"
  | "CAPACITY_REACHED"
  | "CODES_EXCEED_CAPACITY";
export type ProviderCode =
  | "PROFILE_INCOMPLETE"
  | "NOT_APPROVED"
  | "NOT_REJECTED"
  | "ALREADY_REQUESTED"
  | "ALREADY_JOINED"
  | "TARGET_UNAVAILABLE"
  | "REQUEST_DECIDED"
  | "EMAIL_LOCKED"
  | "NO_EMAIL";
export type ProblemCodeValue =
  CommonCode | IdentityCode | PatientCode | MediaCode | NsmqCode | ProviderCode;

// ---------- Paging ----------
export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}
export interface PageParams {
  page?: number;
  size?: number;
}

/** null when there is no image; private photos are signed URLs valid 15 min. */
export interface Image {
  url: string;
  thumbnailUrl: string;
}

// ---------- Enums ----------
export type Role = "PATIENT" | "PROVIDER" | "CURATOR";
export type PatientNext =
  "PHOTO" | "SCHOOL_TYPE" | "PROGRAMME" | "GRADE" | "FINISH" | "HOME";
export type ProviderNext = "PROFILE_SETUP" | "PENDING" | "REJECTED" | "HOME";
export type ProviderStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
export type Gender = "MALE" | "FEMALE";
export type CampusCard = "HIGH_SCHOOL" | "COLLEGE";
export type CodePurpose = "SIGN_UP" | "RECOVERY" | "CLAIM";
export type NsmqKind = "D1" | "T3" | "TPLUS";
export type RunStatus = "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";
export type Tag = "911" | "NOW" | "ASAP";
export type CrossFlag = "NONE" | "MIND" | "BODY" | "FULL";
export type Urgency = "NOW" | "SOON" | "ROUTINE";
export type Grade =
  "SHS_1" | "SHS_2" | "SHS_3" | "YEAR_1" | "YEAR_2" | "YEAR_3" | "YEAR_4";
export type ContactKind = "EMAIL" | "PHONE";
export type VersionStatus = "OPENS_SOON" | "LIVE" | "CLOSED" | "INVITE_ONLY";
export type EnrollmentStatus = "ACTIVE" | "SUSPENDED";
export type TeamStatus = "REGISTERED" | "ACTIVE" | "ELIMINATED" | "CHAMPION";
export type CareStatus = "TREATING" | "REFERRED";
export type ResultSource = "QUICK_SCREEN" | "TRIAGE_RUN";
export type JoinRequestKind =
  "PROVIDER_APPLICATION" | "JOIN_CAMPUS" | "JOIN_HOST";
export type JoinRequestStatus = "PENDING" | "APPROVED" | "DECLINED";
export type JoinTargetType = "CAMPUS" | "HOST";
export type Period = "TODAY" | "WEEK" | "MONTH" | "YEAR";
export type CareApp = "QUICK_SCREEN" | "ACCOUNT";
/** Quick Screen only; null for NSMQ. */
export type Colour = "BLACK" | "RED" | "LIGHT_GREEN" | "GREEN" | "PURPLE";

// ---------- Notifications ----------
export type NotificationType =
  | "APPLICATION_ACCEPTED"
  | "APPLICATION_REJECTED"
  | "JOIN_APPROVED"
  | "JOIN_DECLINED"
  | "PROVIDER_ADDED"
  | "PROVIDER_REMOVED"
  | "HOST_ADDED"
  | "HOST_REMOVED"
  | "HOST_PROVIDER_ADDED"
  | "NEW_RESULTS"
  | "URGENT_RESULT"
  | "PATIENT_SEEN"
  | "RESULT_OVERDUE"
  | (string & {});

export interface Notification {
  id: UUID;
  /** Always null for provider notifications. */
  campusId: UUID | null;
  type: NotificationType;
  title: string;
  body: string;
  /** e.g. "/results/{id}" — an API path, not an app route. */
  link: string | null;
  data: Record<string, string | number | null>;
  readAt: ISOInstant | null;
  createdAt: ISOInstant;
}

export interface UnreadCounts {
  total: number;
  campuses: { campusId: UUID; unread: number }[];
}

export interface NotificationListParams extends PageParams {
  unread?: boolean;
  campusId?: UUID;
}

// ---------- SSE (GET /me/stream) ----------
export interface SseNotification {
  id: UUID;
  type: NotificationType;
  title: string;
  campusId: UUID | null;
  unread: number;
}
export interface SseProviderStatus {
  status: "APPROVED" | "REJECTED";
  next: "HOME" | "REJECTED";
}
export type SseEventName = "notification" | "provider-status" | "just-in";

// ---------- Auth ----------
export interface PatientMeProfile {
  fullName: string;
  initials: string;
  nickname: string;
  onboarded: boolean;
}
export interface ProviderMeProfile {
  providerId: UUID;
  title: string | null;
  fullName: string;
  initials: string;
  status: ProviderStatus;
  submittedAt: ISOInstant | null;
}
export type Me =
  | {
      accountId: UUID;
      role: "PATIENT";
      contact: string;
      next: PatientNext;
      profile: PatientMeProfile | null;
    }
  | {
      accountId: UUID;
      role: "PROVIDER";
      contact: string;
      next: ProviderNext;
      profile: ProviderMeProfile | null;
    }
  | {
      accountId: UUID;
      role: "CURATOR";
      contact: string;
      next: string;
      profile: unknown;
    };

export interface LookupRequest {
  contact: string;
  role: Role;
}
export interface LookupResponse {
  exists: boolean;
  claimed: boolean;
  nickname: string | null;
}
export interface SignInRequest {
  contact: string;
  role: Role;
  password: string;
}
export interface VerifyRequest {
  contact: string;
  role: Role;
  purpose: CodePurpose;
  code: string;
}
/** SIGN_UP → {me}; RECOVERY/CLAIM → {grant}. */
export interface VerifyResponse {
  me: Me | null;
  grant: string | null;
}
export interface CodeRequest {
  contact: string;
  role: Role;
  purpose: CodePurpose;
}
export interface RecoveryRequest {
  contact: string;
  role: Role;
}
/** The field is `email`, not `contact`. */
export interface ClaimRequest {
  email: string;
  role: Role;
}
export interface PasswordRequest {
  grant: string;
  password: string;
}
export interface ProviderSignUpRequest {
  email: string;
  password: string;
  title: string;
  fullName: string;
}
export interface RoleCategory {
  id: UUID;
  name: string;
  dormant: boolean;
  roles: CategoryRole[];
  version: number;
}
export interface CategoryRole {
  id: UUID;
  name: string;
  emoji: string;
  active: boolean;
}

// ---------- Provider profile ----------
export interface RoleGroup {
  id: UUID;
  name: string;
}
export type MissingField =
  "title" | "fullName" | "phone" | "roleCategoryIds" | "photo";
export interface ProviderProfile {
  id: UUID;
  title: string | null;
  fullName: string;
  initials: string;
  nicknames: string[];
  email: string | null;
  phone: string | null;
  photo: Image | null;
  slogan: string | null;
  clinicianNotes: string | null;
  bio: string | null;
  clinical: boolean;
  status: ProviderStatus;
  next: ProviderNext;
  submittedAt: ISOInstant | null;
  decidedAt: ISOInstant | null;
  roleGroups: RoleGroup[];
  missing: MissingField[];
  hasAccount: boolean;
  claimed: boolean;
  studioCreated: boolean;
  version: number;
}
export interface ProviderSummary {
  id: UUID;
  title: string | null;
  fullName: string;
  initials: string;
  photo: Image | null;
  status: ProviderStatus;
  clinical: boolean;
  roleGroups: RoleGroup[];
}
/** All optional; omitted = unchanged. "" clears phone/slogan/clinicianNotes. */
export interface ProviderPatchRequest {
  version?: number;
  title?: string;
  fullName?: string;
  phone?: string;
  slogan?: string;
  clinicianNotes?: string;
  /** Whole ordered list; the first is the default role group. */
  roleCategoryIds?: UUID[];
}

// ---------- Campuses ----------
export interface CampusCardItem {
  id: UUID;
  fullName: string;
  nicknames: string[];
  motto: string | null;
  type: string;
  card: CampusCard;
  logo: Image | null;
  lockedIn: number;
}
export interface CampusListParams extends PageParams {
  card?: CampusCard;
  type?: string;
  q?: string;
}

// ---------- Join requests ----------
export interface JoinTarget {
  type: JoinTargetType;
  id: UUID;
  name: string | null;
}
export interface JoinRequestView {
  id: UUID;
  kind: JoinRequestKind;
  status: JoinRequestStatus;
  createdAt: ISOInstant;
  decidedAt: ISOInstant | null;
  applicant: ProviderSummary | null;
  /** null for PROVIDER_APPLICATION. */
  target: JoinTarget | null;
}
export interface JoinRequestBody {
  targetType: JoinTargetType;
  targetId: UUID;
}

// ---------- Results ----------
export interface Score {
  score: number;
  colour: Colour | null;
}
export interface LastView {
  providerId: UUID;
  name: string;
  initials: string;
  at: ISOInstant;
}
export interface ResultItem {
  id: UUID;
  displayName: string;
  initials: string;
  age: number | null;
  gender: string | null;
  yearLabel: string | null;
  /** QS: "EXAM" | "LOSS"; NSMQ: NsmqKind. */
  variant: string | null;
  createdAt: ISOInstant;
  urgent: boolean;
  urgentReason: string | null;
  attention: boolean;
  awaitingAcceptance: boolean;
  active: boolean;
  /** Quick Screen only. */
  lockedIn: Score | null;
  suicidality: string | null;
  lastProviderView: LastView | null;
  seen: boolean;
  treatingStartedAt: ISOInstant | null;
  respondBy: ISOInstant | null;
  overdue: boolean;
}
export interface OutcomeView {
  sectionCode: string;
  sectionTitle: string;
  parentCode: string | null;
  score: number | null;
  maxScore: number | null;
  band: string;
  colour: Colour | null;
}
export interface ResultCareView {
  providerId: UUID;
  name: string | null;
  status: CareStatus;
  referredBy: UUID | null;
  at: ISOInstant;
}
/** NSMQ: outcomes[0] is {sectionCode:"TAG", sectionTitle:"Triage", band: Tag, score: load}. */
export interface ResultDetail {
  campusId: UUID;
  campusName: string | null;
  source: ResultSource;
  result: ResultItem;
  outcomes: OutcomeView[];
  care: ResultCareView[];
}
export interface BandView {
  band: string;
  colour: Colour | null;
  count: number;
  percent: number;
}
export interface SummarySection {
  sectionCode: string;
  title: string;
  parentCode: string | null;
  outcomes: BandView[];
}
export interface RankItem {
  sectionCode: string;
  title: string;
  band: string;
  count: number;
}
export interface ResultSummary {
  total: number;
  lockedIn: BandView[];
  sections: SummarySection[];
  suicidality: BandView[];
  ranking: RankItem[];
  groups: {
    TODAY: number;
    WEEK: number;
    MONTH: number;
    YEAR: number;
    ALL: number;
  };
}
export interface CommentView {
  id: UUID;
  authorAccountId: UUID;
  body: string;
  at: ISOInstant;
}
export interface ResultFilters {
  active?: boolean;
  period?: Period;
  variant?: string;
  ageFrom?: number;
  ageTo?: number;
  gender?: Gender;
  year?: string;
  /** "SECTION:Band", repeated. */
  outcome?: string[];
}
export interface BenchmarkAverages {
  averages: Record<string, { average: number | null; count: number }>;
}
export interface Benchmarks {
  campus?: { id: UUID } & BenchmarkAverages;
  campusType?: { type: string } & BenchmarkAverages;
  overall: BenchmarkAverages;
}
export interface CareRequest {
  status: CareStatus;
  referToProviderId?: UUID;
}

// ---------- NSMQ runs and care cases ----------
export interface RunSection {
  code: string;
  title: string;
  score: number | null;
  maxScore: number | null;
  level: 0 | 1 | 2 | 3 | 4;
  band: string;
  carried: boolean;
}
export interface RunAnswer {
  itemCode: string;
  optionId: UUID;
  optionLabel: string;
}
export interface StaffRun {
  id: UUID;
  accountId: UUID;
  studentName: string | null;
  campusId: UUID;
  kind: NsmqKind;
  attempt: number;
  status: RunStatus;
  tag: Tag | null;
  tagReason: string | null;
  load: number | null;
  loadMax: number | null;
  peak: number | null;
  cross: CrossFlag | null;
  engineRevision: string | null;
  historical: boolean;
  untagged: boolean;
  submittedAt: ISOInstant | null;
  respondBy: ISOInstant | null;
  sections: RunSection[];
  answers: RunAnswer[];
  resultId: UUID | null;
}
export interface CareCase {
  id: UUID;
  accountId: UUID;
  studentName: string | null;
  initials: string;
  campusId: UUID;
  effectiveTag: Tag | null;
  sourceRunId: UUID | null;
  tagReason: string | null;
  submittedAt: ISOInstant | null;
  respondBy: ISOInstant | null;
  clearedAt: ISOInstant | null;
  updatedAt: ISOInstant;
}
export interface Clearance {
  clearedBy: UUID;
  note: string;
  clearedAt: ISOInstant;
  runId: UUID | null;
}

// ---------- Care catalogue ----------
export interface Treatment {
  id: UUID;
  name: string;
  rank: number;
  photo: Image | null;
}
export interface OutcomeCare {
  outcomeId: UUID;
  sectionCode: string;
  sectionTitle: string;
  band: string;
  label: string;
  treatments: Treatment[];
}
export interface TreatmentView {
  id: UUID;
  name: string;
  defaultRank: number;
  photo: Image | null;
  version: number;
}
