import { describe, expect, it, vi, beforeEach } from "vitest";
import type { LockInStudent } from "@/lib/types/entities/lockin";
import type { PatientResult } from "@/lib/types/entities/patient";
import type { School } from "@/lib/types/entities/school";

const getSchoolLockIn = vi.fn();
const getSchoolResults = vi.fn();

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    api: vi.fn(),
  };
});

vi.mock("../shared/lock-ins", () => ({
  lockinsService: {
    getSchoolLockIn,
  },
}));

vi.mock("../shared/patients", () => ({
  patientsService: {
    getSchoolResults,
  },
}));

vi.mock("@/lib/constants/infra/endpoints", () => ({
  STATIC_ENDPOINTS: {
    SCHOOLS: "/schools",
    SCHOOLS_BATCH: "/schools/batch",
  },
  DYNAMIC_ENDPOINTS: {
    SCHOOLS: {
      GET: (id: string | number) => `/schools/${id}`,
      UPDATE: (id: string | number) => `/schools/${id}`,
      DISABLE: (id: string | number) => `/schools/${id}/disable`,
      PROVIDERS: (id: string | number) => `/schools/${id}/providers`,
      PATIENTS_OVERVIEW: (id: string | number) =>
        `/schools/${id}/patients-overview`,
      ADD_PROVIDER: (schoolId: string | number, providerEmail: string) =>
        `/schools/${schoolId}/add-provider?providerEmail=${providerEmail}`,
      REMOVE_PROVIDER: (schoolId: string | number, providerEmail: string) =>
        `/schools/${schoolId}/remove-provider?providerEmail=${providerEmail}`,
    },
  },
}));

describe("schoolsService", () => {
  beforeEach(() => {
    vi.resetModules();
    getSchoolLockIn.mockReset();
    getSchoolResults.mockReset();
  });

  it("getSchools returns data array from success response", async () => {
    const schools = [{ id: 1, name: "North High" }] satisfies School[];
    const { api } = await import("@/lib/api");
    vi.mocked(api).mockResolvedValue({
      success: true,
      message: "ok",
      data: schools,
    });

    const { schoolsService } = await import("./schools");
    await expect(schoolsService.getSchools()).resolves.toEqual(schools);
  });

  it("getSchools returns empty array when response is not successful", async () => {
    const { api } = await import("@/lib/api");
    vi.mocked(api).mockResolvedValue({
      success: false,
      message: "error",
      data: null,
    });

    const { schoolsService } = await import("./schools");
    await expect(schoolsService.getSchools()).resolves.toEqual([]);
  });

  it("getSchool throws when fetch fails", async () => {
    const { api } = await import("@/lib/api");
    vi.mocked(api).mockResolvedValue({
      success: false,
      message: "error",
      data: null,
    });

    const { schoolsService } = await import("./schools");
    await expect(schoolsService.getSchool("1")).rejects.toThrow(
      "Failed to fetch school",
    );
  });

  it("getSchoolReach returns fallback when request fails", async () => {
    const { api } = await import("@/lib/api");
    vi.mocked(api).mockResolvedValue({
      success: false,
      message: "error",
      data: null,
    });

    const { schoolsService } = await import("./schools");
    await expect(schoolsService.getSchoolReach(9)).resolves.toEqual({
      schoolName: "",
      reach: 0,
    });
  });

  it("getSchoolStudents merges patient results and sorts by createdAt", async () => {
    const students = [
      {
        studentName: "Jane Doe",
        lockinScore: 4,
        lockedInInterpretation: "Moderate",
        lockedInColor: "yellow",
      },
      {
        studentName: "John Smith",
        lockinScore: 3,
        lockedInInterpretation: "Low",
        lockedInColor: "green",
      },
    ] satisfies LockInStudent[];

    const results = [
      {
        id: 10,
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
        createdAt: "2024-02-01T00:00:00.000Z",
        firstOpenedAt: null,
        openedByCurrentUser: false,
        treatingProviders: [],
        lockinScore: 4.5,
      },
      {
        id: 11,
        lockinId: 43,
        schoolId: 7,
        schoolName: "Example High",
        patientName: "John Smith",
        patientAge: 17,
        patientSex: "M",
        patientLevel: "SHS",
        visibilityStatus: "SEEN",
        starProvider: null,
        referredProvider: null,
        createdAt: "2024-03-01T00:00:00.000Z",
        firstOpenedAt: null,
        openedByCurrentUser: false,
        treatingProviders: [],
        lockinScore: 3.5,
      },
    ] satisfies PatientResult[];

    getSchoolLockIn.mockResolvedValue({ students });
    getSchoolResults.mockResolvedValue(results);

    const { schoolsService } = await import("./schools");
    const merged = await schoolsService.getSchoolStudents("7");

    expect(getSchoolLockIn).toHaveBeenCalledWith("7");
    expect(getSchoolResults).toHaveBeenCalledWith("7");
    expect(merged[0]?.studentName).toBe("John Smith");
    expect(merged[0]?.patientResultId).toBe(11);
    expect(merged[1]?.studentName).toBe("Jane Doe");
    expect(merged[1]?.patientResultId).toBe(10);
  });

  it("getSchoolStudents returns empty array when lock-in fetch fails", async () => {
    getSchoolLockIn.mockRejectedValue(new Error("network"));

    const { schoolsService } = await import("./schools");
    await expect(schoolsService.getSchoolStudents("7")).resolves.toEqual([]);
    expect(getSchoolResults).not.toHaveBeenCalled();
  });
});
