"use client";
import { ProviderCardProps } from "@/lib/types/components/curator/providers/provider-card";

export const useProviderCard = ({
  provider,
  onViewDetails,
  onShowApproveModal,
  onShowRejectModal,
  isModerating,
  currentAction,
  moderatingProviderId,
}: ProviderCardProps) => {
  const handleApproveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowApproveModal(provider.id);
  };

  const handleRejectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowRejectModal(provider.id);
  };

  const handleViewDetails = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onViewDetails(provider.id);
  };

  const isApproving =
    currentAction === "approving" && moderatingProviderId === provider.id;
  const isRejecting =
    currentAction === "rejecting" && moderatingProviderId === provider.id;

  const isActionDisabled = isModerating && moderatingProviderId === provider.id;

  return {
    handleApproveClick,
    handleRejectClick,
    handleViewDetails,
    isApproving,
    isRejecting,
    isActionDisabled,
  };
};
