import type { ProviderProfile, ProviderSummary } from "@/lib/v2/curator/types";
import type { Provider, ProviderDetails } from "@/lib/types/entities/provider";

// v2 → the curator screens' provider shape. Providers are keyed by UUID now;
// `email` is only on the full profile (and may be null for Studios providers).

type ApplicationStatus = NonNullable<Provider["applicationStatus"]>;

// DRAFT providers haven't applied yet; the screens group them with PENDING.
function toApplicationStatus(
  status: ProviderSummary["status"],
): ApplicationStatus {
  return status === "DRAFT" ? "PENDING" : status;
}

export function fromProviderSummary(summary: ProviderSummary): Provider {
  return {
    id: summary.id,
    email: "",
    providerName: summary.fullName,
    providerTitle: summary.title,
    specialty: summary.roleGroups[0]?.name ?? null,
    profilePhotoURL: summary.photo?.thumbnailUrl ?? summary.photo?.url ?? null,
    applicationStatus: toApplicationStatus(summary.status),
  };
}

export function fromProviderProfile(profile: ProviderProfile): ProviderDetails {
  return {
    id: profile.id,
    email: profile.email ?? "",
    providerName: profile.fullName,
    providerTitle: profile.title,
    specialty: profile.roleGroups[0]?.name ?? undefined,
    specialties: profile.roleGroups.map((group) => group.name),
    officePhoneNumber: profile.phone,
    profilePhotoURL: profile.photo?.url ?? null,
    bio: profile.bio ?? profile.slogan,
    status: profile.slogan,
    applicationStatus: toApplicationStatus(profile.status),
    applicationDate: profile.submittedAt ?? undefined,
    createdAt: profile.submittedAt ?? undefined,
    updatedAt: profile.decidedAt ?? profile.submittedAt ?? undefined,
  };
}
