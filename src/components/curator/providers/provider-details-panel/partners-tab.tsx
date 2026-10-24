import { FiUsers, FiMinus, FiSearch, FiPlus } from "react-icons/fi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PartnersTabProps } from "@/lib/types/components/curator/providers/provider-details-panel";
import { AssociatedPartner } from "@/lib/types/entities/partners";
import { Input } from "@/components/ui/input";

export const PartnersTab = ({
  isLoadingPartners,
  associatedPartners,
  partnerSearchQuery,
  setPartnerSearchQuery,
  filteredAvailablePartners,
  setPartnerToRemove,
  setPartnerToAdd,
  associationsAvailable = false,
}: PartnersTabProps) => {
  return (
    <div className="space-y-6">
      {/* Associated Partners */}
      <div>
        <h4 className="mb-3 font-semibold">Associated Partners</h4>
        {isLoadingPartners ? (
          <div className="text-muted-foreground py-8 text-center">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-teal-500"></div>
            <p>Loading partners...</p>
          </div>
        ) : associatedPartners.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <FiUsers className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
            <p>
              {associationsAvailable
                ? "No partners associated yet"
                : "This provider's partners can't be listed yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {associatedPartners.map((partner: AssociatedPartner) => (
              <div
                key={partner.id}
                className="bg-card border-border flex items-center justify-between rounded-lg border p-4 transition-colors hover:border-teal-500/30"
              >
                <div className="flex items-center gap-3">
                  {partner.logo ? (
                    <div className="border-border h-12 w-12 shrink-0 overflow-hidden rounded-lg border">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-teal-500 to-cyan-500">
                      <FiUsers className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{partner.name}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setPartnerToRemove(partner)}
                  variant="ghost"
                  className="border-destructive text-destructive hover:bg-destructive/80 flex h-8 w-8 items-center justify-center rounded-full border-2 p-0 transition-colors"
                  aria-label="Remove partner"
                >
                  <FiMinus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Partners */}
      <div>
        <h4 className="mb-3 font-semibold">Available Partners</h4>
        {isLoadingPartners ? (
          <div className="text-muted-foreground py-4 text-center">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="text-muted-foreground h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Search partners..."
                value={partnerSearchQuery}
                onChange={(e) => setPartnerSearchQuery(e.target.value)}
                className="border-input placeholder-muted-foreground w-full border bg-transparent py-2 pr-4 pl-10 transition-all"
              />
            </div>

            {filteredAvailablePartners.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">
                {partnerSearchQuery
                  ? "No partners found matching your search."
                  : "All partners are already associated."}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredAvailablePartners.map((partner: AssociatedPartner) => (
                  <div
                    key={partner.id}
                    className="bg-card/50 border-border hover:bg-muted-foreground flex items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {partner.logo ? (
                        <div className="border-border h-12 w-12 shrink-0 overflow-hidden rounded-lg border">
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="bg-muted-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                          <FiUsers className="text-muted-foreground h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{partner.name}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setPartnerToAdd(partner)}
                      variant="ghost"
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-400 p-0 text-green-500 transition-colors hover:bg-green-50"
                      aria-label="Add partner"
                    >
                      <FiPlus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
