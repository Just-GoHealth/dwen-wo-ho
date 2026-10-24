"use client";

import { useCuratorPatientDetails } from "@/hooks/curator/patient-details/use-patient-details";
import {
  PatientDetailsErrorView,
  PatientDetailsLoadingView,
} from "@/components/curator/patient-dashboard/page-states";
import { PatientDetailsPageContent } from "@/components/curator/patient-dashboard/page-content";

export default function PatientDetailsPage() {
  const details = useCuratorPatientDetails();
  const { router, detail, isLoading } = details;

  if (isLoading) {
    return <PatientDetailsLoadingView />;
  }

  if (!detail) {
    return <PatientDetailsErrorView onBack={() => router.back()} />;
  }

  return <PatientDetailsPageContent details={details} />;
}
