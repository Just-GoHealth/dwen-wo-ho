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
    })),
  };
}

/** Real board data when this patient has one, else null so callers fall
 * back to the older lockin-assessment-derived metrics. */
export function mapBoardToMetricCategories(
  board: BoardResponse | null,
): MetricCategory[] | null {
  if (!board?.sections?.length) return null;
  return board.sections.map(mapSection);
}
