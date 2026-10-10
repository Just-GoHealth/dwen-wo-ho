import { describe, expect, it } from "vitest";
import type { LockinUpdateResponse } from "@/lib/types/api/lockin";
import type { PatientResult } from "@/lib/types/entities/patient";
import {
  buildAssessmentColorMap,
  mapLockInUpdateToAssessment,
} from "./map-lockin-to-assessment";

const patientResult = {
  id: 1,
  lockinId: 42,
  schoolId: 7,
  schoolName: "Example High",
  patientName: "Jane Doe",
  patientAge: 16,
  patientSex: "F",
  patientLevel: "SHS",
  visibilityStatus: "NEW",
  starProvider: null,
  referredProvider: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  firstOpenedAt: null,
  openedByCurrentUser: false,
  treatingProviders: [],
  lockinScore: 4.5,
} satisfies PatientResult;

const lockInUpdate = {
  lockinId: 42,
  patientName: "Jane Doe",
  patientAge: 16,
  patientSex: "F",
  schoolName: "Example High",
  schoolType: "SHS",
  lockinDate: "2024-01-02T00:00:00.000Z",
  lockedInScore: 4.5,
  lockedInScoreDescription: "Moderate",
  lockedInColor: "yellow",
  generalMentalHealthScore: 3,
  depressionScore: 2,
  lonelinessScore: 1,
  suicidalityScore: 0,
  examAnxietyScore: 4,
  coreAnxietyScore: 3,
  physicalDistressScore: 2,
  examPreparationScore: 5,
  motivationScore: 4,
  studySkillsScore: 3,
  procrastinationScore: 2,
  schoolTypeAverages: {
    schoolType: "SHS",
    averageLockedInScore: 4,
    averageGeneralMentalHealthScore: 3,
    averageDepressionScore: 2,
    averageLonelinessScore: 2,
    averageSuicidalityScore: 1,
    averageExamAnxietyScore: 3,
    averageCoreAnxietyScore: 3,
    averagePhysicalDistressScore: 2,
    averageExamPreparationScore: 4,
    averageMotivationScore: 4,
    averageStudySkillsScore: 3,
    averageProcrastinationScore: 2,
    sampleSize: 10,
  },
  assessmentItems: [
    {
      itemName: "Overall Mental Health",
      category: "mental",
      score: 3,
      maxScore: 10,
      description: "Overall",
      color: "green",
    },
    {
      itemName: "Possible Depression",
      category: "mental",
      score: 2,
      maxScore: 10,
      description: "Depression",
      color: "yellow",
    },
  ],
  inUrgentCare: false,
} satisfies LockinUpdateResponse;

describe("buildAssessmentColorMap", () => {
  it("maps item names to colors", () => {
    expect(
      buildAssessmentColorMap([
        { itemName: "Loneliness", color: "red" },
        { itemName: "Motivation", color: "blue" },
      ]),
    ).toEqual({
      Loneliness: "red",
      Motivation: "blue",
    });
  });
});

describe("mapLockInUpdateToAssessment", () => {
  it("maps lock-in data and applies color map fallbacks", () => {
    const colorMap = buildAssessmentColorMap(lockInUpdate.assessmentItems);
    const result = mapLockInUpdateToAssessment(
      lockInUpdate,
      patientResult,
      colorMap,
    );

    expect(result.fullName).toBe("Jane Doe");
    expect(result.school).toBe("Example High");
    expect(result.lockedInScore).toBe("4.50");
    expect(result.generalMentalHealthColor).toBe("green");
    expect(result.possibleDepressionColor).toBe("yellow");
    expect(result.lonelinessColor).toBe("gray");
    expect(result.inUrgentCare).toBe(false);
  });
});
