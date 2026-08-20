"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MdHealthAndSafety } from "react-icons/md";
import WidthConstraint from "@/components/ui/width-constraint";
import ProviderDetailsPanel from "@/components/curator/providers/provider-details-panel";
import ProviderCard from "@/components/curator/providers/provider-card/index";
import { ProviderCardSkeletonGrid } from "@/components/curator/providers/provider-card/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useCuratorProviders } from "@/hooks/curator/providers/use-providers";

function ProvidersPageContent() {
  const searchParams = useSearchParams();
  const {
    isLoading,
    isError,
    error,
    providersList,
    filteredProviders,
    filterOptions,
    selectedProvider,
    filter,
    setFilter,
    showProviderModal,
    setShowProviderModal,
    selectedProviderEmail,
    showApproveModal,
    setShowApproveModal,
    showRejectModal,
    setShowRejectModal,
    modalProviderEmail,
    setModalProviderEmail,
    currentAction,
    handleProviderSelect,
    handleShowApproveModal,
    handleShowRejectModal,
    handleApproveConfirm,
    handleRejectConfirm,
    getProviderName,
  } = useCuratorProviders();

  // Auto-open provider modal from notification query param
  useEffect(() => {
    const providerModalEmail = searchParams.get("providerModal");
    if (providerModalEmail && !isLoading && providersList.length > 0) {
      // Check if provider exists in list before opening
      const providerExists = providersList.some(
        (p) => p.email === providerModalEmail,
      );
      if (providerExists) {
        handleProviderSelect(providerModalEmail);
        // Clean up URL by removing query param
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [searchParams, isLoading, providersList, handleProviderSelect]);

  if (isLoading) {
    return (
      <WidthConstraint>
        <div className="flex flex-col gap-6 md:p-6">
          <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
            <Skeleton className="mb-2 h-8 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <ProviderCardSkeletonGrid />
        </div>
      </WidthConstraint>
    );
  }

  if (isError) {
    return (
      <WidthConstraint>
        <div className="flex flex-col gap-6 p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="mb-2 font-medium text-red-600">
              Failed to load providers
            </p>
            <p className="text-sm text-red-500">
              {error?.message || "An error occurred"}
            </p>
          </div>
        </div>
      </WidthConstraint>
    );
  }

  return (
    <WidthConstraint>
      <div className="flex flex-col gap-6 md:p-6">
        {/* Header */}
        <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold lg:text-3xl">Providers</h1>
                <p className="text-muted-foreground text-sm">
                  Manage and review healthcare providers
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  filter === option.id
                    ? `${option.color} text-white shadow-md`
                    : `${option.inactiveColor} ${option.hoverColor}`
                }`}
              >
                {option.label}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    filter === option.id
                      ? "bg-background/10 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filteredProviders.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <MdHealthAndSafety className="mx-auto mb-4 text-6xl text-gray-300" />
              <p className="text-lg font-medium text-gray-600">
                No providers found
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Providers will appear here once they are registered
              </p>
            </div>
          ) : (
            filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.email}
                provider={provider}
                onViewDetails={handleProviderSelect}
                onShowApproveModal={handleShowApproveModal}
                onShowRejectModal={handleShowRejectModal}
                isModerating={currentAction !== null}
                currentAction={currentAction}
                moderatingProviderEmail={modalProviderEmail}
              />
            ))
          )}
        </div>

        {/* Provider Details Modal */}
        <ProviderDetailsPanel
          isOpen={showProviderModal}
          onClose={() => setShowProviderModal(false)}
          providerEmail={selectedProviderEmail}
          provider={selectedProvider}
          onShowApproveModal={handleShowApproveModal}
          onShowRejectModal={handleShowRejectModal}
          isModerating={currentAction !== null}
          currentAction={currentAction}
          moderatingProviderEmail={modalProviderEmail}
        />

        {/* Approve Confirmation Modal */}
        <ConfirmationModal
          isOpen={showApproveModal}
          onClose={() => {
            setShowApproveModal(false);
            setModalProviderEmail("");
          }}
          onConfirm={handleApproveConfirm}
          title="Approve Provider Confirmation"
          message={`Are you sure you want to approve ${getProviderName(modalProviderEmail)} as a provider?`}
          confirmText="Yes, Approve"
          variant="success"
          isLoading={currentAction === "approving"}
        />

        {/* Reject Confirmation Modal */}
        <ConfirmationModal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setModalProviderEmail("");
          }}
          onConfirm={handleRejectConfirm}
          title="Reject Provider Confirmation"
          message={`Are you sure you want to reject ${getProviderName(modalProviderEmail)}'s provider application?`}
          confirmText="Yes, Reject"
          variant="danger"
          isLoading={currentAction === "rejecting"}
        />
      </div>
    </WidthConstraint>
  );
}

export default function ProvidersPage() {
  return (
    <Suspense fallback={null}>
      <ProvidersPageContent />
    </Suspense>
  );
}
