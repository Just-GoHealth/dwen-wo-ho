import type { Colour, OutcomeView, ResultDetail, Tag } from "@/lib/v2/types";
import type { MetricCategory } from "@/hooks/provider/patient-details/use-patient-details";

/** Quick Screen band colours (NSMQ outcomes carry no colour). */
const COLOUR_HEX: Record<Colour, string> = {
  BLACK: "#2b1210",
  RED: "#ed4b58",
  LIGHT_GREEN: "#8fd694",
  GREEN: "#2bb673",
  PURPLE: "#8b5cf6",
};
const NO_COLOUR = "#e8d4ad";

const colourOf = (c: Colour | null) => (c ? COLOUR_HEX[c] : NO_COLOUR);

const scoreLabel = (o: OutcomeView) =>
  o.score === null
    ? "—"
    : o.maxScore !== null
      ? `${o.score}/${o.maxScore}`
      : String(o.score);

const TAG_SECTION = "TAG";

/**
 * Domes from a v2 result: top-level outcomes (no `parentCode`) become
 * categories, and their children the rows inside each dome. The NSMQ
 * "TAG" pseudo-section is the triage tag, shown separately.
 */
export function mapOutcomesToMetricCategories(
  outcomes: OutcomeView[],
): MetricCategory[] {
  const sections = outcomes.filter((o) => o.sectionCode !== TAG_SECTION);
  const roots = sections.filter(
    (o) =>
      !o.parentCode || !sections.some((p) => p.sectionCode === o.parentCode),
  );
  return roots.map((root) => ({
    name: root.sectionTitle,
    description: root.band,
    score: scoreLabel(root),
    color: colourOf(root.colour),
    items: sections
      .filter((o) => o.parentCode === root.sectionCode)
      .map((child) => ({
        name: child.sectionTitle,
        description: child.band,
        value: scoreLabel(child),
        color: colourOf(child.colour),
      })),
  }));
}

/** NSMQ: outcomes[0] is {sectionCode:"TAG", band: Tag}. Null for Quick Screen. */
export function triageTagOf(detail: ResultDetail): Tag | null {
  const tag = detail.outcomes.find((o) => o.sectionCode === TAG_SECTION)?.band;
  return tag === "911" || tag === "NOW" || tag === "ASAP" ? tag : null;
}
