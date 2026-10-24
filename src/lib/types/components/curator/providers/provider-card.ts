import type { Provider } from "@/lib/types/entities/provider";

export interface ProviderCardProps {
  provider: Provider;
  onViewDetails: (providerId: string) => void;
  onShowApproveModal: (providerId: string) => void;
  onShowRejectModal: (providerId: string) => void;
  isModerating?: boolean;
  currentAction?: "approving" | "rejecting" | null;
  moderatingProviderId?: string | null;
}
