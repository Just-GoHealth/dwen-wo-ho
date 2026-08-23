import { useEffect, useState } from "react";
import { patientsService } from "@/services/provider/dashboard/patients";

// GET /v1/patient-results/{resultId} (PatientResultResponse) has no photo
// field at all — confirmed against this backend's OpenAPI spec, not a
// naming mismatch. The provider patients LIST endpoint's PatientCase DOES
// have a confirmed real avatarUrl, so this cross-references the two: find
// the list entry for this same patientResultId and borrow its avatarUrl.
// Best-effort — a school with many patients, or one this search doesn't
// surface on the first page, just falls back to no photo (initials).
export function useProviderPatientAvatar(
  resultId: number | undefined,
  schoolId: number | undefined,
  patientName: string | undefined,
) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!resultId || !schoolId || !patientName) return;
    let cancelled = false;
    patientsService
      .getPatients({
        schoolId: String(schoolId),
        search: patientName,
        limit: 50,
      })
      .then((res) => {
        if (cancelled) return;
        const match = res.patients.find((p) => p.patientResultId === resultId);
        if (match?.avatarUrl) setAvatarUrl(match.avatarUrl);
      })
      .catch(() => {
        // best-effort only — leave avatarUrl unset, Avatar falls back to initials
      });
    return () => {
      cancelled = true;
    };
  }, [resultId, schoolId, patientName]);

  return avatarUrl;
}
