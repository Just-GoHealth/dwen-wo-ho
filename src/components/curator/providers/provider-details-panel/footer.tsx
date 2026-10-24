"use client";

import { FiCheck, FiX } from "react-icons/fi";
import { LoadingButton } from "@/components/ui/loading-button";
import { ProviderFooterProps } from "@/lib/types/components/curator/providers/provider-details-panel";

export const ProviderFooter = ({
  applicationStatus,
  handleApproveClick,
  handleRejectClick,
  isModerating,
  moderatingProviderId,
  providerId,
  currentAction,
}: ProviderFooterProps) => {
  const isTargetingThisProvider =
    isModerating && moderatingProviderId === providerId;
  const isApproving = currentAction === "approving" && isTargetingThisProvider;
  const isRejecting = currentAction === "rejecting" && isTargetingThisProvider;

  return (
    <div className="border-border bg-muted/40 border-t p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        {applicationStatus === "PENDING" && (
          <div className="flex flex-1 gap-2">
            <LoadingButton
              onClick={handleApproveClick}
              loading={isApproving}
              loadingText="Approving..."
              disabled={isTargetingThisProvider && !isApproving}
              className="bg-muted/80 text-success hover:bg-muted flex h-auto flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiCheck className="h-4 w-4" />
              Approve
            </LoadingButton>
            <LoadingButton
              onClick={handleRejectClick}
              loading={isRejecting}
              loadingText="Rejecting..."
              disabled={isTargetingThisProvider && !isRejecting}
              variant="outline"
              className="bg-muted/80 hover:bg-muted/50 text-destructive border-border flex h-auto flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiX className="h-4 w-4" />
              Reject
            </LoadingButton>
          </div>
        )}
        {/* TODO(v2-backend): no endpoint to revoke an approval or re-approve a
            rejection; only PENDING applications are decided (Just In). */}
        {applicationStatus === "APPROVED" && (
          <div className="bg-success/50 text-success border-success flex flex-1 items-center justify-center gap-1 rounded-lg border px-4 py-2.5 text-sm font-semibold">
            <FiCheck className="h-4 w-4" />
            Approved
          </div>
        )}
        {applicationStatus === "REJECTED" && (
          <div className="bg-destructive/10 text-destructive flex flex-1 items-center justify-center gap-1 rounded-lg px-4 py-2.5 text-sm font-semibold">
            <FiX className="h-4 w-4" />
            Rejected
          </div>
        )}
      </div>
    </div>
  );
};
