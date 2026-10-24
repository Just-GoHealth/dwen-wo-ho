import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {
  CommentView,
  OutcomeView,
  ResultDetail,
} from "@/lib/v2/curator/types";

export interface PatientHeaderProps {
  detail: ResultDetail;
  onBack: () => void;
  /** Toggles Active / Inactive (PATCH /results/{id}). */
  onToggleActive: () => void;
  isTogglingActive: boolean;
  /** Shown while the result awaits acceptance (C19). */
  onAccept: () => void;
  isAccepting: boolean;
}

export interface PatientMetricItem {
  name: string;
  description: string;
  value: string;
  color: string;
}

export interface PatientMetricCategory {
  name: string;
  description: string;
  score: string;
  items: PatientMetricItem[];
}

export interface PatientMetricsProps {
  metrics: PatientMetricCategory[];
}

export interface AssessmentDetailsCardProps {
  detail: ResultDetail;
}

export interface UrgentCareStatusCardProps {
  detail: ResultDetail;
}

/** One section's average from GET /benchmarks. */
export interface BenchmarkAverage {
  average: number | null;
  count: number;
}

export interface Benchmarks {
  campus?: { id: string; averages: Record<string, BenchmarkAverage> };
  campusType?: { type: string; averages: Record<string, BenchmarkAverage> };
  overall: { averages: Record<string, BenchmarkAverage> };
}

export interface SchoolTypeComparisonCardProps {
  outcomes: OutcomeView[];
  benchmarks: Benchmarks | null;
}

export interface PatientCommentsPanelProps {
  comments: CommentView[];
  isLoading: boolean;
  onAddComment: (body: string) => Promise<unknown>;
  isAdding: boolean;
  /** `fieldError("body")` from the last failed post. */
  bodyError?: string;
}

export interface CuratorPatientDetailsState {
  router: AppRouterInstance;
  detail: ResultDetail | null;
  isLoading: boolean;
  isError: boolean;
  metrics: PatientMetricCategory[];
  benchmarks: Benchmarks | null;
  comments: CommentView[];
  isCommentsLoading: boolean;
  addComment: (body: string) => Promise<unknown>;
  isAddingComment: boolean;
  commentError?: string;
  toggleActive: () => void;
  isTogglingActive: boolean;
  accept: () => void;
  isAccepting: boolean;
}

export interface PatientDetailsErrorViewProps {
  onBack: () => void;
}

export interface PatientDetailsPageContentProps {
  details: CuratorPatientDetailsState;
}
