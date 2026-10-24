import { Provider } from "@/lib/types/entities/provider";

export interface ProviderProfile extends Provider {
  schools?: import("@/lib/types/api/provider-dashboard").ProviderCampusSummary[];
  partners?: import("@/lib/types/api/providers").ProviderAssociatedPartner[];
}

export interface ProviderStats {
  schools: number;
  partners: number;
  totalStudents: number;
  pendingStudents: number;
}

export interface ProviderProfileCardProps {
  provider: ProviderProfile;
}

export interface ProviderStatsGridProps {
  stats: ProviderStats;
}
