import { describe, expect, it } from "vitest";
import type { OutcomeView } from "@/lib/v2/curator/types";
import { buildOutcomeMetrics, triageOutcome } from "./outcome-metrics";

const outcome = (o: Partial<OutcomeView>): OutcomeView => ({
  sectionCode: "X",
  sectionTitle: "X",
  parentCode: null,
  score: null,
  maxScore: null,
  band: "Good",
  colour: null,
  ...o,
});

describe("buildOutcomeMetrics", () => {
  it("groups sub-sections under their top-level section", () => {
    const metrics = buildOutcomeMetrics([
      outcome({
        sectionCode: "GMH",
        sectionTitle: "General Mental Health",
        score: 6,
        maxScore: 10,
        band: "Average",
      }),
      outcome({
        sectionCode: "DEP",
        sectionTitle: "Depression",
        parentCode: "GMH",
        score: 3,
        maxScore: 9,
        band: "Poor",
        colour: "RED",
      }),
      outcome({
        sectionCode: "LON",
        sectionTitle: "Loneliness",
        parentCode: "GMH",
        score: 1,
        band: "Good",
        colour: "LIGHT_GREEN",
      }),
    ]);

    expect(metrics).toHaveLength(1);
    expect(metrics[0]).toMatchObject({
      name: "General Mental Health",
      description: "Average",
      score: "6/10",
    });
    expect(metrics[0]!.items.map((i) => [i.name, i.value])).toEqual([
      ["Depression", "3/9"],
      ["Loneliness", "1"],
    ]);
    expect(metrics[0]!.items[0]!.color).toBe("var(--destructive)");
  });

  it("makes a one-row card for a section with no sub-sections", () => {
    const metrics = buildOutcomeMetrics([
      outcome({
        sectionCode: "EXAM",
        sectionTitle: "Exam Anxiety",
        score: null,
      }),
    ]);
    expect(metrics[0]!.items).toEqual([
      expect.objectContaining({ name: "Exam Anxiety", value: "—" }),
    ]);
  });

  it("leaves the NSMQ triage pseudo-section out", () => {
    const outcomes = [
      outcome({
        sectionCode: "TAG",
        sectionTitle: "Triage",
        band: "911",
        score: 14,
      }),
      outcome({ sectionCode: "GMH", sectionTitle: "GMH" }),
    ];
    expect(buildOutcomeMetrics(outcomes).map((m) => m.name)).toEqual(["GMH"]);
    expect(triageOutcome(outcomes)?.band).toBe("911");
  });
});
