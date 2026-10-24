"use client";
import { ScoreRing as UiScoreRing } from "@just-gohealth/ui";

/** Patient risk-score ring — backed by `@just-gohealth/ui`'s ScoreRing. */
export default function ScoreRing({ score }: { score: number | string }) {
  // Keep the app's existing parsing (integer part of string scores).
  const cleanedScore = typeof score === "string" ? parseInt(score) : score;
  return <UiScoreRing score={cleanedScore} />;
}
