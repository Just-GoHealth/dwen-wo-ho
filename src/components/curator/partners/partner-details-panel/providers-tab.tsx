import Image from "next/image";
import { FiUsers, FiSearch, FiMinus, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ProvidersTabProps } from "@/lib/types/components/curator/partners/partner-details-panel";
import { AssociatedProvider } from "@/lib/types/entities/partners";
import { formatProviderName } from "@/lib/utils/shared/provider-name";
import { Input } from "@/components/ui/input";

export const ProvidersTab = ({
  isLoadingProviders,
  associatedProviders,
  filteredAvailableProviders,
  providerSearchQuery,
  setProviderSearchQuery,
  handleProviderClick,
  setProviderToRemove,
  setProviderToAdd,
}: ProvidersTabProps) => {
  return (
    <div className="space-y-6">
      {/* Associated Providers */}
      <div>
        <h4 className="mb-3 font-semibold text-gray-900">
          Associated Providers
        </h4>
        {isLoadingProviders ? (
          <div className="text-muted-foreground py-8 text-center">
            <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <p>Loading providers...</p>
          </div>
        ) : associatedProviders.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <FiUsers className="mx-auto mb-2 h-12 w-12 text-gray-300" />
            <p>No providers associated yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {associatedProviders.map((provider: AssociatedProvider) => (
              <Button
                key={provider.id}
                onClick={() => handleProviderClick(provider)}
                className="bg-background border-border hover:border-primary/30 flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  {provider.profilePhotoURL ? (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-200">
                      <Image
                        src={provider.profilePhotoURL}
                        alt={provider.providerName}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-cyan-500">
                      <FiUsers className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {formatProviderName(
                        provider.providerName,
                        provider.providerTitle,
                      )}
                    </p>
                    {provider.specialty && (
                      <p className="text-sm text-gray-600">
                        {provider.specialty}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProviderToRemove(provider);
                  }}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors"
                  aria-label="Remove provider"
                >
                  <FiMinus className="h-4 w-4" />
                </Button>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Available Providers */}
      <div>
        <h4 className="mb-3 font-semibold text-gray-900">
          Available Providers
        </h4>
        <div className="relative mb-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search providers..."
            value={providerSearchQuery}
            onChange={(e) => setProviderSearchQuery(e.target.value)}
            className="bg-background border-border focus:ring-primary/20 focus:border-primary text-foreground placeholder-muted-foreground w-full rounded-lg border py-2 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none"
          />
        </div>

        {filteredAvailableProviders.length === 0 ? (
          <p className="py-4 text-center text-gray-500">
            {providerSearchQuery
              ? "No providers found matching your search."
              : "All providers are already associated."}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredAvailableProviders.map((provider: AssociatedProvider) => (
              <div
                key={provider.id}
                className="bg-background border-border hover:border-primary/30 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {provider.profilePhotoURL ? (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-200">
                      <Image
                        src={provider.profilePhotoURL}
                        alt={provider.providerName}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-cyan-500">
                      <FiUsers className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {formatProviderName(
                        provider.providerName,
                        provider.providerTitle,
                      )}
                    </p>
                    {provider.specialty && (
                      <p className="text-sm text-gray-600">
                        {provider.specialty}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => setProviderToAdd(provider)}
                  className="border-success/50 text-success hover:bg-success/10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors"
                  aria-label="Add provider"
                >
                  <FiPlus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
