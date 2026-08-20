"use client";
import Image from "next/image";
import { timeAgo } from "@/lib/utils/shared/time-ago";
import { FiCheck, FiX } from "react-icons/fi";
import { formatProviderName } from "@/lib/utils/shared/provider-name";
import { LoadingButton } from "@/components/ui/loading-button";
import { ProviderCardProps } from "@/lib/types/components/curator/providers/provider-card";
import { DEFAULT_PROVIDER_IMAGE } from "@/lib/constants/components/curator/providers/provider-card";
import { useProviderCard } from "@/hooks/components/curator/providers/provider-card/use-provider-card";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";

const ProviderCard = (props: ProviderCardProps) => {
  const { provider } = props;
  const {
    handleApproveClick,
    handleRejectClick,
    handleViewDetails,
    isApproving,
    isRejecting,
    isActionDisabled,
  } = useProviderCard(props);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View details for ${formatProviderName(
        provider.providerName || "",
        provider.providerTitle,
      )}`}
      onClick={handleViewDetails}
      onKeyDown={activateOnKeyboard(handleViewDetails)}
      className="bg-card border-border hover:border-primary/50 group relative flex w-full flex-col items-center rounded-xl border p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      {/* Provider Image - Centered at Top */}
      <div className="ring-muted group-hover:ring-primary/20 mb-4 size-16 overflow-hidden rounded-full ring-4 transition-all duration-300">
        <Image
          src={provider.profilePhotoURL || DEFAULT_PROVIDER_IMAGE}
          alt={formatProviderName(
            provider.providerName || "",
            provider.providerTitle,
          )}
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Provider Info - Centered */}
      <div className="w-full text-center">
        <h3 className="group-hover:text-primary mb-2 truncate px-1 text-lg font-bold transition-colors">
          {formatProviderName(
            provider.providerName || "",
            provider.providerTitle,
          )}
        </h3>
        <p className="text-muted-foreground mb-3 truncate px-1 text-sm">
          {provider.specialty || "General Practice"}
        </p>

        {/* Time Added */}
        <p className="mb-4 text-xs font-medium text-orange-500">
          Added {timeAgo(provider.applicationDate || "")}
        </p>

        {/* Status Badge or Action Buttons */}
        <div className="flex w-full justify-center gap-2 px-1">
          {provider.applicationStatus === "APPROVED" ? (
            <>
              <div className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-green-200 bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                <FiCheck className="h-4 w-4" />
                Approved
              </div>

              <LoadingButton
                onClick={handleRejectClick}
                loading={isRejecting}
                loadingText="Rejecting..."
                disabled={isActionDisabled && !isRejecting}
                className="border-destructive/40 bg-destructive/20 text-destructive hover:bg-destructive/30 z-20 flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiX className="h-4 w-4" />
                Reject
              </LoadingButton>
            </>
          ) : provider.applicationStatus === "REJECTED" ? (
            <>
              <LoadingButton
                onClick={handleApproveClick}
                loading={isApproving}
                loadingText="Approving..."
                disabled={isActionDisabled && !isApproving}
                className="border-success/40 bg-success/20 text-success hover:bg-success/30 z-20 flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiCheck className="h-4 w-4" />
                Approve
              </LoadingButton>
              <div className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                <FiX className="h-4 w-4" />
                Rejected
              </div>
            </>
          ) : (
            <>
              <LoadingButton
                onClick={handleApproveClick}
                loading={isApproving}
                loadingText="Approving..."
                disabled={isActionDisabled && !isApproving}
                className="border-success/40 bg-success/20 text-success hover:bg-success/30 z-20 flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiCheck className="h-4 w-4" />
                Approve
              </LoadingButton>

              <LoadingButton
                onClick={handleRejectClick}
                loading={isRejecting}
                loadingText="Rejecting..."
                disabled={isActionDisabled && !isRejecting}
                className="border-destructive/40 bg-destructive/20 text-destructive hover:bg-destructive/30 z-20 flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiX className="h-4 w-4" />
                Reject
              </LoadingButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
