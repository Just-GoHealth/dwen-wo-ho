"use client";

import { ROUTES } from "@/lib/constants/infra/routes";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { useCuratorProviderDetails } from "@/hooks/curator/provider-details/use-provider-details";
import {
  ProviderDetailsHeader,
  ProviderProfileCard,
  ProviderSpecialtiesCard,
  ProviderActionButtons,
  ProviderStatusDisplay,
} from "@/components/curator/provider-details";

export function CuratorProviderDetailsScreen() {
  const {
    provider,
    isLoading,
    isActionLoading,
    successMessage,
    isAuthenticated,
    handleApprove,
    handleReject,
    getStatusColor,
    router,
  } = useCuratorProviderDetails();

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  if (isLoading) {
    return (
      <LoadingOverlay text="Loading provider details..." isVisible={true} />
    );
  }

  if (!provider) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Provider Not Found
          </h1>
          <Button onClick={() => router.push(ROUTES.curator.providers)}>
            Back to Providers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingOverlay
        text="Processing request..."
        isVisible={isActionLoading}
      />

      <ProviderDetailsHeader
        status={provider.status || "PENDING"}
        statusColor={getStatusColor(provider.status || "PENDING")}
        onBackClick={() => router.push(ROUTES.curator.providers)}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-center font-medium text-green-600">
              {successMessage}
            </p>
          </div>
        )}

        <ProviderProfileCard provider={provider} />

        <ProviderSpecialtiesCard specialties={provider.specialties || []} />

        {provider.status === "PENDING" ? (
          <ProviderActionButtons
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={isActionLoading}
          />
        ) : (
          <ProviderStatusDisplay
            status={provider.status || "PENDING"}
            updatedAt={provider.updatedAt}
          />
        )}
      </div>
    </div>
  );
}
