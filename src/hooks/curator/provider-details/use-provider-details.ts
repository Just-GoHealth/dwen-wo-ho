"use client";

import { useParams } from "next/navigation";
import { getStatusColor } from "@/lib/utils/provider/application-status";
import { useCuratorAuth } from "@/hooks/curator/auth/use-auth";
import { useCuratorProviderList } from "@/hooks/curator/provider-list/use-provider-list";
import { useCuratorProviderApproval } from "@/hooks/curator/provider-approval/use-provider-approval";

export function useCuratorProviderDetails() {
  const params = useParams();
  const providerId = decodeURIComponent(params.providerId as string);

  const { isAuthenticated, router } = useCuratorAuth();

  const { provider, isLoading, refetch } = useCuratorProviderList(
    providerId,
    isAuthenticated,
  );

  const { isActionLoading, successMessage, handleApprove, handleReject } =
    useCuratorProviderApproval(providerId, () => void refetch());

  return {
    provider,
    isLoading,
    isActionLoading,
    successMessage,
    isAuthenticated,
    handleApprove,
    handleReject,
    getStatusColor,
    router,
  };
}
