"use client";

import { useState } from "react";
import { curatorProvidersService } from "@/services/curator/providers";
import { hasCode, toastCuratorError } from "@/lib/v2/curator/errors";

/** Approve/decline the provider's pending application (Just In). */
export function useCuratorProviderApproval(
  providerId: string,
  onDecided?: () => void,
) {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const decide = async (approve: boolean) => {
    setIsActionLoading(true);
    setSuccessMessage("");

    try {
      if (approve) {
        await curatorProvidersService.approveProvider(providerId);
      } else {
        await curatorProvidersService.rejectProvider(providerId);
      }
      setSuccessMessage(
        approve
          ? "Provider approved successfully!"
          : "Provider rejected successfully!",
      );
      onDecided?.();
    } catch (error: unknown) {
      // REQUEST_DECIDED: someone else already decided; reload to show it.
      if (hasCode(error, "REQUEST_DECIDED")) onDecided?.();
      toastCuratorError(error, {
        fallback: approve
          ? "Failed to approve provider. Please try again."
          : "Failed to reject provider. Please try again.",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    isActionLoading,
    successMessage,
    handleApprove: () => decide(true),
    handleReject: () => decide(false),
  };
}
