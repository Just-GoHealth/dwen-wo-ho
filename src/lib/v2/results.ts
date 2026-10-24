import { http } from "./http";
import type {
  Benchmarks,
  CareRequest,
  CommentView,
  Page,
  PageParams,
  ResultDetail,
  ResultFilters,
  ResultItem,
  ResultSummary,
  UUID,
} from "./types";

/**
 * Campus results (4c). A campus or result the provider can't see answers
 * 404 NOT_FOUND, never 403 — callers treat that as "not available to you".
 */
export const resultsApi = {
  list: (campusId: UUID, filters: ResultFilters & PageParams = {}) =>
    http.get<Page<ResultItem>>(`/campuses/${campusId}/results`, {
      query: { ...filters },
    }),
  summary: (campusId: UUID, filters: ResultFilters = {}) =>
    http.get<ResultSummary>(`/campuses/${campusId}/results/summary`, {
      query: { ...filters },
    }),
  urgent: (campusId?: UUID) =>
    http.get<ResultItem[]>("/results/urgent", { query: { campusId } }),
  benchmarks: (params: { campusId?: UUID; campusType?: string } = {}) =>
    http.get<Benchmarks>("/benchmarks", { query: { ...params } }),
  /** Opening a result records the view. */
  get: (id: UUID) => http.get<ResultDetail>(`/results/${id}`),
  setActive: (id: UUID, active: boolean) =>
    http.patch<ResultDetail>(`/results/${id}`, { active }),
  setCare: (id: UUID, body: CareRequest) =>
    http.put<ResultDetail>(`/results/${id}/care`, body),
  comments: (id: UUID) => http.get<CommentView[]>(`/results/${id}/comments`),
  addComment: (id: UUID, body: string) =>
    http.post<CommentView>(`/results/${id}/comments`, { body }),
};
