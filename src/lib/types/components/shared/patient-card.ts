import type { MouseEvent } from "react";
import type { SchoolPatientRecord } from "@/lib/types/components/curator/school-details/school-details";
import type { PatientCase } from "@/lib/types/api/patient-results";

export interface PatientCardProps<T> {
  patient: T;
  index?: number;
  onActionClick?: (id: string | number) => void;
  detailRoute?: (patientId: string | number) => string;
  /** Extract the unique identifier from the patient object - null for a
   * curator roster entry with no submitted result yet (see
   * SchoolPatientRecord.id) */
  getId?: (patient: T) => string | number | null;
  /** Extract the lockin score from the patient object */
  getScore?: (patient: T) => number;
  /** Extract the visibility status from the patient object */
  getStatus?: (patient: T) => string;
  /** Extract the timestamp from the patient object */
  getTime?: (patient: T) => string;
  /** Extract the preview/comment text from the patient object */
  getPreview?: (patient: T) => string | null | undefined;
  /** Extract the patient name from the patient object */
  getPatientName?: (patient: T) => string;
  /** Extract the school nickname from the patient object */
  getSchoolNickname?: (patient: T) => string | undefined;
  /** Extract the school name from the patient object */
  getSchoolName?: (patient: T) => string;
  /** Extract the avatar photo URL from the patient object, if any */
  getAvatarUrl?: (patient: T) => string | null | undefined;
  selectedPatients?: Set<string | number>;
  handleSelectPatient?: (id: string | number, checked: boolean) => void;
  showCheckbox: boolean;
}

export type PatientCardPatient = SchoolPatientRecord | PatientCase;

export interface PatientCardAccessorFns<T> {
  getId: (patient: T) => string | number | null;
  getScore: (patient: T) => number;
  getStatus: (patient: T) => string;
  getTime: (patient: T) => string;
  getPreview: (patient: T) => string | null | undefined;
  getPatientName: (patient: T) => string;
  getSchoolNickname: (patient: T) => string | undefined;
  getSchoolName: (patient: T) => string;
  getAvatarUrl: (patient: T) => string | null | undefined;
}

export interface PatientCardResolvedFields {
  id: string | number | null;
  score: number;
  status: string;
  time: string;
  preview: string | null | undefined;
  patientName: string;
  schoolNickname: string | undefined;
  schoolName: string;
  avatarUrl: string | null | undefined;
}

export interface PatientCardInfoProps {
  patientName: string;
  time: string;
  schoolNickname: string | undefined;
  schoolName: string;
  preview: string | null | undefined;
  statusLabel: string;
  statusClassName: string;
}

export interface PatientCardActionProps {
  actionLabel: string;
  onClick: (e: MouseEvent) => void;
}
