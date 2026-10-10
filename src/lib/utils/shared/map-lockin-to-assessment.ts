import type { LockinUpdateResponse } from "@/lib/types/api/lockin";
import type { LockInAssessment } from "@/lib/types/entities/lockin";
import type { PatientResult } from "@/lib/types/entities/patient";

type AssessmentItemColor = {
  itemName: string;
  color: string;
};

function stringOrNA(value: unknown): string {
  return value == null ? "N/A" : String(value);
}

function colorOrGray(colorMap: Record<string, string>, key: string): string {
  return colorMap[key] ?? "gray";
}

function formatLockedInScore(score: unknown): string {
  return typeof score === "number" ? score.toFixed(2) : String(score ?? "N/A");
}

function buildMentalHealthFields(
  data: LockinUpdateResponse,
  colorMap: Record<string, string>,
) {
  return {
    generalMentalHealth: stringOrNA(data.generalMentalHealthDescription),
    generalMentalHealthScore: stringOrNA(data.generalMentalHealthScore),
    generalMentalHealthColor: colorOrGray(colorMap, "Overall Mental Health"),
    possibleDepressionScore: stringOrNA(data.depressionScore),
    possibleDepressionDescription: stringOrNA(data.depressionDescription),
    possibleDepressionColor: colorOrGray(colorMap, "Possible Depression"),
    lonelinessScore: stringOrNA(data.lonelinessScore),
    lonelinessScoreDescription: stringOrNA(data.lonelinessDescription),
    lonelinessColor: colorOrGray(colorMap, "Loneliness"),
    suicidalRiskScore: stringOrNA(data.suicidalityScore),
    suicidalRiskScoreDescription: stringOrNA(data.suicidalityDescription),
    suicidalRiskColor: colorOrGray(colorMap, "Suicidal Risk"),
  };
}

function buildAnxietyFields(
  data: LockinUpdateResponse,
  colorMap: Record<string, string>,
) {
  return {
    examAnxiety: stringOrNA(data.examAnxietyDescription),
    examAnxietyScore: stringOrNA(data.examAnxietyScore),
    examAnxietyColor: colorOrGray(colorMap, "Overall Exam Anxiety"),
    coreAnxietyScore: stringOrNA(data.coreAnxietyScore),
    coreAnxietyScoreDescription: stringOrNA(data.coreAnxietyDescription),
    coreAnxietyColor: colorOrGray(colorMap, "Core Anxiety"),
    physicalDistressScore: stringOrNA(data.physicalDistressScore),
    physicalDistressScoreDescription: stringOrNA(
      data.physicalDistressDescription,
    ),
    physicalDistressColor: colorOrGray(colorMap, "Physical Distress"),
  };
}

function buildStudyFields(
  data: LockinUpdateResponse,
  colorMap: Record<string, string>,
) {
  return {
    examPrep: stringOrNA(data.examPreparationDescription),
    examPrepScore: stringOrNA(data.examPreparationScore),
    examPrepColor: colorOrGray(colorMap, "Overall Exam Preparation"),
    motivationScore: stringOrNA(data.motivationScore),
    motivationScoreDescription: stringOrNA(data.motivationDescription),
    motivationColor: colorOrGray(colorMap, "Motivation"),
    studySkillsScore: stringOrNA(data.studySkillsScore),
    studySkillsScoreDescription: stringOrNA(data.studySkillsDescription),
    studySkillsColor: colorOrGray(colorMap, "Study Skills"),
    procrastinationScore: stringOrNA(data.procrastinationScore),
    procrastinationScoreDescription: stringOrNA(
      data.procrastinationDescription,
    ),
    procrastinationColor: colorOrGray(colorMap, "Procrastination"),
  };
}

export function buildAssessmentColorMap(
  items: AssessmentItemColor[],
): Record<string, string> {
  const colorMap: Record<string, string> = {};

  for (const item of items) {
    colorMap[item.itemName] = item.color;
  }

  return colorMap;
}

export function mapLockInUpdateToAssessment(
  data: LockinUpdateResponse,
  patientResult: PatientResult,
  colorMap: Record<string, string>,
): LockInAssessment {
  return {
    lockinId: data.lockinId,
    fullName: patientResult.patientName,
    age: patientResult.patientAge,
    sex: patientResult.patientSex,
    school: patientResult.schoolName,
    schoolType: data.schoolType,
    comment: data.comment,
    lockinDate: data.lockinDate,
    lockedInScore: formatLockedInScore(data.lockedInScore),
    lockedInScoreDescription: stringOrNA(data.lockedInScoreDescription),
    lockedInColor: stringOrNA(data.lockedInColor),
    ...buildMentalHealthFields(data, colorMap),
    ...buildAnxietyFields(data, colorMap),
    ...buildStudyFields(data, colorMap),
    inUrgentCare: data.inUrgentCare,
    urgentCareEnteredAt: data.urgentCareEnteredAt,
    timeInUrgentCareMinutes: data.timeInUrgentCareMinutes,
    schoolTypeAverages: data.schoolTypeAverages,
    assessmentItems: data.assessmentItems,
  };
}
