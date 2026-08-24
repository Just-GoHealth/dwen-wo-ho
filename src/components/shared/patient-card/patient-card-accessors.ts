import type { SchoolPatientRecord } from "@/lib/types/components/curator/school-details/school-details";
import type { PatientCase } from "@/lib/types/api/patient-results";
import type {
  PatientCardAccessorFns,
  PatientCardPatient,
  PatientCardProps,
  PatientCardResolvedFields,
} from "@/lib/types/components/shared/patient-card";

const defaultSchoolPatientRecordAccessors = {
  getId: (p: SchoolPatientRecord) => p.id,
  getScore: (p: SchoolPatientRecord) => p.lockinScore,
  getStatus: (p: SchoolPatientRecord) => p.visibilityStatus,
  getTime: (p: SchoolPatientRecord) => p.createdAt,
  getPreview: (p: SchoolPatientRecord) => p.comment,
  getPatientName: (p: SchoolPatientRecord) => p.patientName,
  getSchoolNickname: (p: SchoolPatientRecord) => p.schoolNickname,
  getSchoolName: (p: SchoolPatientRecord) => p.schoolName,
  getAvatarUrl: (p: SchoolPatientRecord) => p.profilePhotoURL,
};

const defaultPatientCaseAccessors = {
  getId: (p: PatientCase) => p.patientId,
  getScore: (p: PatientCase) => p.score,
  getStatus: (p: PatientCase) => p.status,
  getTime: (p: PatientCase) => p.time,
  getPreview: (p: PatientCase) => p.preview,
  getPatientName: (p: PatientCase) => p.patientName,
  getSchoolNickname: (p: PatientCase) => p.schoolNickname,
  getSchoolName: (p: PatientCase) => p.schoolName,
  getAvatarUrl: (p: PatientCase) => p.avatarUrl,
};

function isPatientCase(patient: PatientCardPatient): patient is PatientCase {
  return patient && typeof patient === "object" && "patientResultId" in patient;
}

function resolveAccessors<T extends PatientCardPatient>(
  patient: T,
  overrides: Pick<
    PatientCardProps<T>,
    | "getId"
    | "getScore"
    | "getStatus"
    | "getTime"
    | "getPreview"
    | "getPatientName"
    | "getSchoolNickname"
    | "getSchoolName"
    | "getAvatarUrl"
  >,
): PatientCardAccessorFns<T> {
  const defaults = isPatientCase(patient)
    ? defaultPatientCaseAccessors
    : defaultSchoolPatientRecordAccessors;

  return {
    getId: overrides.getId ?? (defaults.getId as (p: T) => string | number),
    getScore: overrides.getScore ?? (defaults.getScore as (p: T) => number),
    getStatus: overrides.getStatus ?? (defaults.getStatus as (p: T) => string),
    getTime: overrides.getTime ?? (defaults.getTime as (p: T) => string),
    getPreview:
      overrides.getPreview ??
      (defaults.getPreview as (p: T) => string | null | undefined),
    getPatientName:
      overrides.getPatientName ?? (defaults.getPatientName as (p: T) => string),
    getSchoolNickname:
      overrides.getSchoolNickname ??
      (defaults.getSchoolNickname as (p: T) => string | undefined),
    getSchoolName:
      overrides.getSchoolName ?? (defaults.getSchoolName as (p: T) => string),
    getAvatarUrl:
      overrides.getAvatarUrl ??
      (defaults.getAvatarUrl as (p: T) => string | null | undefined),
  };
}

export function resolvePatientCardFields<T extends PatientCardPatient>(
  patient: T,
  accessorOverrides: Pick<
    PatientCardProps<T>,
    | "getId"
    | "getScore"
    | "getStatus"
    | "getTime"
    | "getPreview"
    | "getPatientName"
    | "getSchoolNickname"
    | "getSchoolName"
    | "getAvatarUrl"
  >,
): PatientCardResolvedFields {
  const accessors = resolveAccessors(patient, accessorOverrides);

  return {
    id: accessors.getId(patient),
    score: accessors.getScore(patient),
    status: accessors.getStatus(patient),
    time: accessors.getTime(patient),
    preview: accessors.getPreview(patient),
    patientName: accessors.getPatientName(patient),
    schoolNickname: accessors.getSchoolNickname(patient),
    schoolName: accessors.getSchoolName(patient),
    avatarUrl: accessors.getAvatarUrl(patient),
  };
}
