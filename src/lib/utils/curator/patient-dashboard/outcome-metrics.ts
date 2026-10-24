import type { PatientMetricCategory } from "@/lib/types/components/curator/patient-dashboard";
import type { Colour, OutcomeView } from "@/lib/v2/curator/types";
import { getColorHex } from "@/lib/utils/shared/color-hex";

/** NSMQ results lead with this pseudo-section: band = the triage tag, score = load. */
export const TRIAGE_SECTION = "TAG";

/** v2 colours ("LIGHT_GREEN") onto the theme's named colours ("light green"). */
export function colourHex(colour: Colour | null | undefined): string {
  if (!colour) return "var(--muted-foreground)";
  return getColorHex(colour.toLowerCase().replace("_", " "));
}

function formatScore(score: number | null, maxScore: number | null): string {
  if (score == null) return "—";
  return maxScore != null ? `${score}/${maxScore}` : String(score);
}

/**
 * Groups a result's outcomes for the metrics cards: each top-level section
 * is a card, its sub-sections the rows. A top-level section with no
 * sub-sections is a one-row card. The NSMQ triage pseudo-section is left
 * out (the urgent-care card shows it).
 */
export function buildOutcomeMetrics(
  outcomes: OutcomeView[],
): PatientMetricCategory[] {
  const sections = outcomes.filter((o) => o.sectionCode !== TRIAGE_SECTION);
  const parents = sections.filter((o) => o.parentCode == null);

  return parents.map((parent) => {
    const children = sections.filter(
      (o) => o.parentCode === parent.sectionCode,
    );
    const rows = children.length > 0 ? children : [parent];
    return {
      name: parent.sectionTitle,
      description: parent.band,
      score: formatScore(parent.score, parent.maxScore),
      items: rows.map((row) => ({
        name: row.sectionTitle,
        description: row.band,
        value: formatScore(row.score, row.maxScore),
        color: colourHex(row.colour),
      })),
    };
  });
}

/** The NSMQ triage outcome, if the result has one. */
export function triageOutcome(
  outcomes: OutcomeView[],
): OutcomeView | undefined {
  return outcomes.find((o) => o.sectionCode === TRIAGE_SECTION);
}
