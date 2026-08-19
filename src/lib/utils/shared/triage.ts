/**
 * Client-derived triage tier (911/Now/ASAP) shared by the provider patient
 * grid and the curator school roll.
 *
 * There is no backend severity field backing these tiers yet — this maps the
 * existing 0-10 lockin score and workflow/visibility status onto the
 * mockup's three visual tiers as an approximation. See
 * guide/provider-design-refactor-backend-needs.md for what a real backend
 * field would need to look like.
 */
export type TriageTier = "911" | "now" | "asap";

export function deriveTriageTier(
  score: number | null,
  status: string,
): TriageTier {
  if (status.toLowerCase() === "urgent" || (score !== null && score <= 2.0)) {
    return "911";
  }
  if (score !== null && score <= 4.0) {
    return "now";
  }
  return "asap";
}

export const TRIAGE_TIER_LABELS: Record<TriageTier, string> = {
  "911": "911",
  now: "Now",
  asap: "ASAP",
};

export const TRIAGE_CHIP_VARIANT = {
  "911": "triage-911",
  now: "triage-now",
  asap: "triage-asap",
} as const;

export const TRIAGE_CHIP_VARIANT_LIT = {
  "911": "triage-911-lit",
  now: "triage-now-lit",
  asap: "triage-asap-lit",
} as const;
