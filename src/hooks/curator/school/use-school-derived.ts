"use client";

import { useMemo } from "react";
import { ProviderDetails } from "@/lib/types/entities/provider";
import { SCHOOL_TABS_CONFIG } from "@/lib/constants/components/curator/school-details/tabs";
import {
  formatProviderName,
  getProviderTitle,
} from "@/lib/utils/shared/provider-name";
import type { SchoolPatientRecord } from "@/lib/types/components/curator/school-details/school-details";
import type { SchoolProvider } from "@/lib/types/entities/provider";
import type { SchoolIcon } from "@/lib/types/entities/school";
import type { School } from "@/lib/types/entities/school";

interface UseSchoolDerivedParams {
  school: School | null | undefined;
  patients: SchoolPatientRecord[];
  providers: SchoolProvider[];
  icons: SchoolIcon[];
  appliedSearchQuery: string;
  selectedProviderEmail: string | null;
}

export function useSchoolDerived({
  school,
  patients,
  providers,
  icons,
  appliedSearchQuery,
  selectedProviderEmail,
}: UseSchoolDerivedParams) {
  const filteredPatients = useMemo(() => {
    if (!appliedSearchQuery.trim()) return patients;
    return patients.filter((p) =>
      p.patientName.toLowerCase().includes(appliedSearchQuery.toLowerCase()),
    );
  }, [patients, appliedSearchQuery]);

  const schoolIcons = useMemo(
    () =>
      school
        ? icons.filter((i) => String(i.schoolId) === String(school.id))
        : [],
    [school, icons],
  );

  const tabs = useMemo(
    () =>
      SCHOOL_TABS_CONFIG.map((tab) => ({
        ...tab,
        count:
          tab.key === "patients"
            ? patients.length
            : tab.key === "icons"
              ? schoolIcons.length
              : providers.length,
      })),
    [patients.length, schoolIcons.length, providers.length],
  );

  const selectedProvider = useMemo(() => {
    if (!selectedProviderEmail) return undefined;
    const p = providers.find(
      (provider) => provider.email === selectedProviderEmail,
    );
    if (!p) return undefined;

    return {
      id: p.id,
      email: p.email,
      fullName: formatProviderName(p.providerName, p.providerTitle),
      providerTitle:
        getProviderTitle(p.providerName, p.providerTitle) || undefined,
      professionalTitle: p.specialty || undefined,
      profileImage: p.profilePhotoURL || undefined,
      createdAt: "",
      updatedAt: "",
      applicationStatus: p.applicationStatus as
        "PENDING" | "APPROVED" | "REJECTED",
      applicationDate: "",
      bio: undefined,
      officePhoneNumber: p.officePhoneNumber || undefined,
    } as ProviderDetails;
  }, [selectedProviderEmail, providers]);

  return {
    filteredPatients,
    schoolIcons,
    tabs,
    selectedProvider,
  };
}
