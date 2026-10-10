import type {
  BoardResponse,
  BoardSectionResponse,
} from "@/lib/types/api/patient-results";
import type { MetricCategory } from "@/hooks/provider/patient-details/use-patient-details";

// same conventions just-go-patient's DomeTile uses for the exact same
// BoardSection shape (see src/components/screening/dome-tile.tsx there) -
// kept identical so the severity/band colors read the same across apps.
const SEVERITY_COLOR: Record<string, string> = {
  mild: "#2bb673",
  mod: "#e69a4a",
  sev: "#e0616e",
};

const FAM_COLOR: Record<string, string> = {
  green: "#2bb673",
  gold: "#e8d4ad",
  red: "#ed4b58",
  emg: "#ed4b58",
};

function mapSection(section: BoardSectionResponse): MetricCategory {
  const scoreLabel =
    typeof section.score === "number" && typeof section.max === "number"
      ? `${section.score}/${section.max}`
      : String(section.score ?? "");

  return {
    name: section.title ?? "",
    description: section.band ?? "",
    score: scoreLabel,
    color: FAM_COLOR[section.emergency ? "emg" : (section.fam ?? "gold")],
    items: (section.items ?? []).map((item) => ({
      name: item.name ?? "",
      description: item.label ?? "",
      value: item.label ?? "",
      color: SEVERITY_COLOR[item.severity ?? "mild"],
      severity: item.severity ?? "mild",
    })),
  };
}

// same fixed 3-category names/order as NO_DATA_METRICS in
// use-patient-details.ts and DOME_CAPTIONS in assessment-metrics-panel.tsx -
// AssessmentDomeTile always needs a name to display, so a missing slot
// still gets one of these rather than a blank title.
const PLACEHOLDER_NAMES = [
  "General Mental Health",
  "Exam Anxiety",
  "Exam Prep",
];
const MIN_CATEGORY_COUNT = 3;

function placeholderCategory(name: string): MetricCategory {
  return {
    name,
    description: "No data yet",
    score: "—",
    color: "var(--sw-red-deep)",
    items: [],
  };
}

/** Real board data when this patient has one, else null so callers fall
 * back to the older lockin-assessment-derived metrics. Always at least 3
 * categories - a board scoring fewer sections than that (e.g. one flagged
 * emergency section returned on its own) pads the rest with "no data yet"
 * placeholders instead of leaving the dome row short. */
export function mapBoardToMetricCategories(
  board: BoardResponse | null,
): MetricCategory[] | null {
  if (!board?.sections?.length) return null;
  const real = board.sections.map(mapSection);
  const usedNames = new Set(real.map((c) => c.name));
  const fillerNames = PLACEHOLDER_NAMES.filter((n) => !usedNames.has(n));
  let fillerIndex = 0;
  while (real.length < MIN_CATEGORY_COUNT) {
    const name = fillerNames[fillerIndex] ?? "";
    fillerIndex++;
    real.push(placeholderCategory(name));
  }
  return real;
}
