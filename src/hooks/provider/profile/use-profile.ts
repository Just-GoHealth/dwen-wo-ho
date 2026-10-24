"use client";

import { useProviderMe } from "@/hooks/queries/use-provider-me";
import { useProviderHome } from "@/hooks/queries/use-provider-dashboard";
import { isProviderApproved } from "@/lib/utils/auth/provider-next-route";
import type {
  ProviderProfile as ProviderProfileView,
  ProviderStats,
} from "@/lib/types/components/provider/profile";
import type { ProviderProfile } from "@/lib/v2/types";

/** `GET /providers/me` in the shape the profile card and glass bar read. */
export const toProviderProfileView = (
  profile: ProviderProfile,
): ProviderProfileView => ({
  id: profile.id,
  email: profile.email ?? "",
  providerName: profile.fullName,
  providerTitle: profile.title,
  specialty: profile.roleGroups[0]?.name ?? null,
  officePhoneNumber: profile.phone,
  applicationStatus: profile.status === "DRAFT" ? undefined : profile.status,
  applicationDate: profile.submittedAt ?? undefined,
  profilePhotoURL: profile.photo?.url ?? null,
  status: profile.slogan,
  bio: profile.bio,
});

export function useProviderProfile() {
  const { data: profile, isLoading } = useProviderMe();
  const { data: home } = useProviderHome(isProviderApproved(profile?.next));

  const patients = home?.patients ?? [];
  const schools = home?.schools ?? [];
  const stats: ProviderStats = {
    schools: schools.length,
    // Hosts a provider serves aren't listed to providers in v2.
    partners: 0,
    totalStudents: patients.length,
    pendingStudents: patients.filter((p) => p.status === "new").length,
  };

  return {
    provider: profile
      ? { ...toProviderProfileView(profile), schools }
      : undefined,
    isLoading,
    stats,
  };
}
