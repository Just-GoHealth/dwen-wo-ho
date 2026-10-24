"use client";

import { useState } from "react";
import { useProvidersQuery } from "@/hooks/queries/use-provider";

export const useProviderPanelState = (
  providerId: string,
  onShowApproveModal?: (providerId: string) => void,
  onShowRejectModal?: (providerId: string) => void,
) => {
  const { approveProvider, rejectProvider } = useProvidersQuery({
    enabled: false,
  });
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApproveClick = () => {
    if (onShowApproveModal) {
      onShowApproveModal(providerId);
    } else {
      setShowApproveModal(true);
    }
  };

  const handleRejectClick = () => {
    if (onShowRejectModal) {
      onShowRejectModal(providerId);
    } else {
      setShowRejectModal(true);
    }
  };

  const handleApproveConfirm = () => {
    setShowApproveModal(false);
    approveProvider(providerId);
  };

  const handleRejectConfirm = () => {
    setShowRejectModal(false);
    rejectProvider(providerId);
  };

  return {
    showApproveModal,
    setShowApproveModal,
    showRejectModal,
    setShowRejectModal,
    handleApproveClick,
    handleRejectClick,
    handleApproveConfirm,
    handleRejectConfirm,
  };
};
