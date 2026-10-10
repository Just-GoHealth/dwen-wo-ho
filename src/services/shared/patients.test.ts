import { describe, expect, it, vi, beforeEach } from "vitest";
import type { PatientResult } from "@/lib/types/entities/patient";
import type { LockinUpdateResponse } from "@/lib/types/api/lockin";

const getLockInUpdate = vi.fn();

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    api: vi.fn(),
  };
});

vi.mock("./lock-ins", () => ({
  lockinsService: {
    getLockInUpdate,
  },
}));

vi.mock("@/lib/constants/infra/endpoints", () => ({
  STATIC_ENDPOINTS: { PATIENT_RESULTS: { CREATE: "/patients" } },
  DYNAMIC_ENDPOINTS: {
    PATIENT_RESULTS: {
      GET: (id: string | number) => `/patients/${id}`,
    },
  },
}));

describe("patientsService.getFullPatientDetails", () => {
  beforeEach(() => {
    vi.resetModules();
    getLockInUpdate.mockReset();
  });

  it("returns patient result without assessment when lockinId is missing", async () => {
    const patientResult = {
      id: 1,
      lockinId: 0,
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

    const { api } = await import("@/lib/api");
    vi.mocked(api).mockResolvedValue({
      success: true,
      message: "ok",
      data: patientResult,
    });

    const { patientsService } = await import("./patients");
    const result = await patientsService.getFullPatientDetails(1);

    expect(result.patientResult).toEqual(patientResult);
    expect(result.lockInAssessment).toBeNull();
    expect(getLockInUpdate).not.toHaveBeenCalled();
  });

  it("maps lock-in data when lockinId is present", async () => {
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
      ],
      inUrgentCare: false,
    } satisfies LockinUpdateResponse;

    const { api } = await import("@/lib/api");
    vi.mocked(api).mockResolvedValue({
      success: true,
      message: "ok",
      data: patientResult,
    });
    getLockInUpdate.mockResolvedValue(lockInUpdate);

    const { patientsService } = await import("./patients");
    const result = await patientsService.getFullPatientDetails(1);

    expect(getLockInUpdate).toHaveBeenCalledWith(42);
    expect(result.lockInAssessment?.fullName).toBe("Jane Doe");
    expect(result.lockInAssessment?.lockedInScore).toBe("4.50");
  });
});
