"use client";

import WidthConstraint from "@/components/ui/width-constraint";
import { Building2, Search } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import PartnerDetailsPanel from "@/components/curator/partners/partner-details-panel";
import { useCuratorPartners } from "@/hooks/curator/partners/use-partners";

export default function PartnersPage() {
  const {
    cachedPartners,
    filteredPartners,
    atomLoading,
    searchQuery,
    setSearchQuery,
    showPartnerModal,
    selectedPartnerId,
    selectedPartner,
    handlePartnerClick,
    handleModalClose,
  } = useCuratorPartners();

  return (
    <WidthConstraint>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Partners</h1>
          <p className="text-muted-foreground">Manage partner organizations</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
            <input
              type="text"
              aria-label="Search partners"
              placeholder="Search partners by name, nickname, or slogan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-primary border-border w-full rounded-xl border py-3 pr-4 pl-12 transition-all focus:ring-1 focus:outline-none"
            />
          </div>
        </div>

        {/* Partners Grid - show loading only when no cache and we're fetching */}
        {atomLoading && cachedPartners.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="size-16 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="py-20 text-center">
            <Building2 className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="text-muted-foreground mb-2 text-xl font-semibold">
              {searchQuery ? "No partners found" : "No partners yet"}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first partner to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPartners.map((partner) => (
              <button
                type="button"
                key={partner.id}
                onClick={() => handlePartnerClick(partner)}
                className="rounded-xl border p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {partner.logo ? (
                    <div className="relative h-16 w-16 shrink-0">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={64}
                        height={64}
                        className="h-full w-full rounded-lg object-contain"
                      />
                    </div>
                  ) : (
                    <div className="bg-muted-foreground flex h-16 w-16 shrink-0 items-center justify-center rounded-lg">
                      <Building2 className="h-8 w-8" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 truncate text-lg font-semibold">
                      {partner.name}
                    </h3>
                    {partner.nickname && (
                      <p className="text-muted-foreground mb-1 text-sm">
                        @{partner.nickname}
                      </p>
                    )}
                    {partner.slogan && (
                      <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                        {partner.slogan}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Partner Details Modal */}
      <PartnerDetailsPanel
        isOpen={showPartnerModal}
        onClose={handleModalClose}
        partnerId={selectedPartnerId}
        partner={selectedPartner}
      />
    </WidthConstraint>
  );
}
