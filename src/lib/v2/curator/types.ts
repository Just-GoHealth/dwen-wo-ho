/**
 * Shared v2 types the curator modules need (V2-API-CONTRACT.md §1, §4).
 * The single source of truth is `src/lib/v2/types.ts`; this file re-exports
 * from it and keeps only what has no shared home.
 */

export type {
  UUID,
  ISOInstant,
  ISODate,
  Page,
  PageParams,
  Image,
  ProviderStatus,
  ProviderNext,
  CampusCard,
  NsmqKind,
  RunStatus,
  CrossFlag,
  VersionStatus,
  TeamStatus,
  CareStatus,
  ResultSource,
  JoinRequestKind,
  JoinRequestStatus,
  JoinTargetType,
  Period,
  CareApp,
  Gender,
  Colour,
  RoleGroup,
  MissingField,
  ProviderProfile,
  ProviderSummary,
  JoinTarget,
  JoinRequestView,
  CategoryRole,
  RoleCategory,
  CampusCardItem,
  Score,
  LastView,
  ResultItem,
  OutcomeView,
  ResultCareView,
  ResultDetail,
  BandView,
  SummarySection,
  RankItem,
  ResultSummary,
  CommentView,
  RunSection,
  RunAnswer,
  StaffRun,
  CareCase,
  Treatment,
  OutcomeCare,
} from "../types";

/** The contract calls it `Tag`. */
export type { Tag as TriageTag } from "../types";

/** ReferenceStore.CampusType (patient section; no shared home yet). */
export interface CampusType {
  code: string;
  label: string;
  card: import("../types").CampusCard;
  quickScreenMinAge: number;
  quickScreenMaxAge: number;
  quickScreenYears: string[];
}
