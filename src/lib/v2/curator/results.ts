/**
 * Results and urgent views, as the curator uses them (ResultController, RunController,
 * CareCaseController). The curator also sees results still awaiting acceptance, and
 * accepts them so the campus's providers see them (C19).
 *
 * TODO(v2-shared-types): list/summary/detail/urgent/comments overlap `src/lib/v2/results.ts`
 * (provider side). Once that lands, keep only the curator-only calls here.
 */
import { buildQuery, http } from "@/lib/v2/http";
import { seg } from "./files";
import type {
  CareCase,
  CommentView,
  Gender,
  Page,
  PageParams,
  Period,
  ResultDetail,
  ResultItem,
  ResultSummary,
  StaffRun,
  UUID,
} from "./types";

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

export interface CuratorResultFilters extends ResultFilters, PageParams {
  /** Curator: only results awaiting acceptance. */
  awaiting?: boolean;
}

export const resultsCurator = {
  list: (campusId: UUID, filters: CuratorResultFilters = {}) =>
    http.get<Page<ResultItem>>(
      `/campuses/${seg(campusId)}/results${buildQuery({ ...filters })}`,
    ),
  summary: (campusId: UUID, filters: ResultFilters = {}) =>
    http.get<ResultSummary>(
      `/campuses/${seg(campusId)}/results/summary${buildQuery({ ...filters })}`,
    ),
  /** Opening it is recorded (last viewer, Seen). */
  detail: (resultId: UUID) =>
    http.get<ResultDetail>(`/results/${seg(resultId)}`),
  setActive: (resultId: UUID, active: boolean) =>
    http.patch<ResultDetail>(`/results/${seg(resultId)}`, { active }),
  comments: (resultId: UUID) =>
    http.get<CommentView[]>(`/results/${seg(resultId)}/comments`),
  addComment: (resultId: UUID, body: string) =>
    http.post<CommentView>(`/results/${seg(resultId)}/comments`, { body }),
  accept: (resultId: UUID) =>
    http.post<ResultDetail>(`/results/${seg(resultId)}/accept`),
  acceptAll: (campusId: UUID) =>
    http.post<{ accepted: number }>(
      `/campuses/${seg(campusId)}/results/accept-all`,
    ),

  // Urgent views
  /** Students needing attention, untreated and oldest first; every campus without campusId. */
  urgent: (campusId?: UUID) =>
    http.get<ResultItem[]>(`/results/urgent${buildQuery({ campusId })}`),
  /** Rule 2's queue: submitted runs that failed to score. */
  untaggedRuns: () => http.get<StaffRun[]>("/runs/untagged"),
  run: (runId: UUID) => http.get<StaffRun>(`/runs/${seg(runId)}`),
  /** Standing 911s first. */
  careCases: (campusId: UUID) =>
    http.get<CareCase[]>(`/care-cases${buildQuery({ campusId })}`),
};
