import type { ProviderProfile } from "@/lib/v2/types";

/** What the profile dialog and glass bar show, derived from `GET /providers/me`. */
export interface ProviderProfileData {
  title: string;
  name: string;
  /** First role group's name. */
  specialty: string;
  /** The slogan. */
  status: string;
  phone: string;
  avatarUrl: string;
  email: string;
  memberSince: string;
  lastUpdated: string | null;
  ranking?: string; // frontend-only computed field
}

export const toProviderProfileData = (
  profile: ProviderProfile,
): ProviderProfileData => ({
  title: profile.title ?? "",
  name: profile.fullName,
  specialty: profile.roleGroups[0]?.name ?? "",
  status: profile.slogan ?? "",
  phone: profile.phone ?? "",
  avatarUrl: profile.photo?.url ?? "",
  email: profile.email ?? "",
  memberSince: profile.decidedAt ?? profile.submittedAt ?? "",
  lastUpdated: null,
});

/** A campus the provider serves, as the ring row and profile tabs show it. */
export interface ProviderCampusSummary {
  schoolId: string;
  schoolName: string;
  /** Results currently visible at this campus. */
  count: number;
  hasNotif: boolean;
  avatarUrl: string | null;
  primaryColor: string | null;
}
