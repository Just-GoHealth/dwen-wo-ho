import { api } from "@/lib/api";
import {
  STATIC_ENDPOINTS,
  DYNAMIC_ENDPOINTS,
} from "@/lib/constants/infra/endpoints";
import {
  ICreateSchool,
  IUpdateSchool,
  School,
} from "@/lib/types/entities/school";
import { SchoolProvider } from "@/lib/types/entities/provider";
import { patientsService } from "../shared/patients";
import { lockinsService } from "../shared/lock-ins";
import { LockInStudent } from "@/lib/types/entities/lockin";
import type { UrgentPatient } from "@/lib/types/entities/patient";
import { PatientResult } from "@/lib/types/entities/patient";
import {
  extractArrayData,
  extractSuccessData,
  requireSuccessData,
} from "@/lib/utils/shared/api-result";

const UPDATE_FIELDS = [
  "name",
  "nickname",
  "type",
  "baseline",
  "motto",
  "campuses",
] as const satisfies ReadonlyArray<keyof IUpdateSchool>;

function buildSchoolUpdateBody(data: IUpdateSchool): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const field of UPDATE_FIELDS) {
    if (data[field] !== undefined) {
      body[field] = data[field];
    }
  }
  return body;
}

function appendSchoolCreateFormFields(
  formData: FormData,
  data: ICreateSchool,
): void {
  formData.append("name", data.name);
  formData.append("nickname", data.nickname || "");
  formData.append("type", data.type);
  formData.append("baseline", data.baseline || "");
  formData.append("motto", data.motto || "");
  formData.append("campuses", data.campuses.join(","));
}

function appendSchoolLogo(
  formData: FormData,
  logo: ICreateSchool["logo"],
): void {
  if (!logo) return;
  formData.append("logo", logo);
}

function mergeStudentsWithResults(
  students: LockInStudent[],
  results: PatientResult[],
): LockInStudent[] {
  const resultMap = new Map<string, PatientResult>();
  for (const result of results) {
    resultMap.set(result.patientName, result);
  }

  return students.map((student) => {
    const result = resultMap.get(student.studentName);
    if (!result) return student;

    return {
      ...student,
      lockinId: result.lockinId,
      createdAt: result.createdAt,
      patientResultId: result.id,
      visibilityStatus: result.visibilityStatus,
    };
  });
}

function studentRecencyScore(student: LockInStudent): number {
  if (!student.createdAt) return Number.NEGATIVE_INFINITY;
  return new Date(student.createdAt).getTime();
}

function compareStudentRecency(
  left: LockInStudent,
  right: LockInStudent,
): number {
  const recencyDelta = studentRecencyScore(right) - studentRecencyScore(left);
  if (recencyDelta !== 0) return recencyDelta;
  return left.studentName.localeCompare(right.studentName);
}

function sortStudentsByRecency(students: LockInStudent[]): LockInStudent[] {
  return students.toSorted(compareStudentRecency);
}

function parseSchoolProviders(response: unknown): SchoolProvider[] {
  const data = extractSuccessData<{ providers?: SchoolProvider[] }>(response);
  if (data?.providers) return data.providers;

  const direct = response as { providers?: SchoolProvider[] };
  return direct.providers ?? [];
}

async function loadStudentsWithResults(
  schoolId: string,
  students: LockInStudent[],
): Promise<LockInStudent[]> {
  try {
    const results = await patientsService.getSchoolResults(schoolId);
    if (!Array.isArray(results) || results.length === 0) {
      return students;
    }
    return mergeStudentsWithResults(students, results);
  } catch {
    return students;
  }
}

export const schoolsService = {
  getSchools: async (): Promise<School[]> => {
    const result = await api(STATIC_ENDPOINTS.SCHOOLS);
    return extractArrayData<School>(result);
  },

  getSchool: async (schoolId: string): Promise<School> => {
    const result = await api(DYNAMIC_ENDPOINTS.SCHOOLS.GET(schoolId));
    return requireSuccessData<School>(result, "Failed to fetch school");
  },

  disableSchool: async (schoolId: string): Promise<School> => {
    const result = await api(DYNAMIC_ENDPOINTS.SCHOOLS.DISABLE(schoolId), {
      method: "PUT",
    });
    return requireSuccessData<School>(result, "Failed to disable school");
  },

  createSchool: async (data: ICreateSchool): Promise<School> => {
    const formData = new FormData();
    appendSchoolCreateFormFields(formData, data);
    appendSchoolLogo(formData, data.logo);

    const response = await api(STATIC_ENDPOINTS.SCHOOLS, {
      method: "POST",
      body: formData,
    });
    return requireSuccessData<School>(response, "Failed to create school");
  },

  updateSchool: async (data: IUpdateSchool): Promise<School> => {
    const result = await api(DYNAMIC_ENDPOINTS.SCHOOLS.UPDATE(data.id), {
      method: "PUT",
      body: JSON.stringify(buildSchoolUpdateBody(data)),
    });
    return requireSuccessData<School>(result, "Failed to update school");
  },

  getSchoolProviders: async (schoolId: string): Promise<SchoolProvider[]> => {
    const response = await api(DYNAMIC_ENDPOINTS.SCHOOLS.PROVIDERS(schoolId));
    return parseSchoolProviders(response);
  },

  getPatientsOverview: async (schoolId: string | number) => {
    const response = await api(
      DYNAMIC_ENDPOINTS.SCHOOLS.PATIENTS_OVERVIEW(schoolId),
    );
    const data = extractSuccessData<{
      patients: unknown[];
      urgentCare: {
        totalUrgentCarePatients: number;
        patients: UrgentPatient[];
      };
    }>(response);

    return (
      data ?? {
        patients: [],
        urgentCare: { totalUrgentCarePatients: 0, patients: [] },
      }
    );
  },

  getSchoolStudents: async (schoolId: string): Promise<LockInStudent[]> => {
    let lockInData;
    try {
      lockInData = await lockinsService.getSchoolLockIn(schoolId);
    } catch {
      return [];
    }

    if (!lockInData) return [];

    const students = await loadStudentsWithResults(
      schoolId,
      lockInData.students || [],
    );
    return sortStudentsByRecency(students);
  },

  batchCreateSchools: async (schools: ICreateSchool[]): Promise<School[]> => {
    const result = await api(STATIC_ENDPOINTS.SCHOOLS_BATCH, {
      method: "POST",
      body: JSON.stringify({ data: schools }),
    });
    const created = extractArrayData<School>(result);
    if (created.length > 0) return created;
    throw new Error("Failed to batch create schools");
  },

  addProviderToSchool: async (
    schoolId: string | number,
    providerEmail: string,
  ): Promise<void> => {
    const result = await api(
      DYNAMIC_ENDPOINTS.SCHOOLS.ADD_PROVIDER(schoolId, providerEmail),
      { method: "POST" },
    );
    if (!extractSuccessData(result)) {
      throw new Error("Failed to add provider to school");
    }
  },

  removeProviderFromSchool: async (
    schoolId: string | number,
    providerEmail: string,
  ): Promise<void> => {
    const result = await api(
      DYNAMIC_ENDPOINTS.SCHOOLS.REMOVE_PROVIDER(schoolId, providerEmail),
      { method: "POST" },
    );
    if (!extractSuccessData(result)) {
      throw new Error("Failed to remove provider from school");
    }
  },

  getSchoolReach: async (
    schoolId: string | number,
  ): Promise<{ schoolName: string; reach: number }> => {
    const result = await api(`${STATIC_ENDPOINTS.SCHOOLS}/${schoolId}/reach`);
    return (
      extractSuccessData<{ schoolName: string; reach: number }>(result) ?? {
        schoolName: "",
        reach: 0,
      }
    );
  },
};
