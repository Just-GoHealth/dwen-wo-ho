"use client";

import { useState, useEffect } from "react";
import useUserQuery from "@/hooks/queries/use-user-profile";
import { useProviderDashboardInit } from "@/hooks/queries/use-provider-dashboard";
import {
  ProviderProfile,
  ProviderStats,
} from "@/lib/types/components/provider/profile";

export function useProviderProfile() {
  const { getProfileQuery } = useUserQuery();
  // Same cached query the dashboard uses (same query key) — real patient
  // counts for the stats grid instead of hardcoded zeros.
  const { data: dashboardInit } = useProviderDashboardInit();
  const [stats, setStats] = useState<ProviderStats>({
    schools: 0,
    partners: 0,
    totalStudents: 0,
    pendingStudents: 0,
  });

  useEffect(() => {
    if (getProfileQuery.data) {
      const data = getProfileQuery.data as ProviderProfile;
      const schools = data.schools || [];
      const partners = data.partners || [];
      const patients = dashboardInit?.patients ?? [];

      setStats({
        schools: Array.isArray(schools) ? schools.length : 0,
        partners: Array.isArray(partners) ? partners.length : 0,
        totalStudents: patients.length,
        pendingStudents: patients.filter(
          (p) => p.status?.toLowerCase() === "new",
        ).length,
      });
    }
  }, [getProfileQuery.data, dashboardInit?.patients]);

  return {
    provider: getProfileQuery.data as ProviderProfile | undefined,
    isLoading: getProfileQuery.isLoading,
    stats,
  };
}
