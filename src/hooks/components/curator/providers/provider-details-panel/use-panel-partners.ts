"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import usePartnerQuery from "@/hooks/queries/use-partner";
import { AssociatedPartner, Partner } from "@/lib/types/entities/partners";
import { ProviderDetails } from "@/lib/types/entities/provider";

export const useProviderPanelPartners = (
  isOpen: boolean,
  providerId: string,
  provider: ProviderDetails | null,
  invalidateProvider: (providerId: string) => Promise<void>,
) => {
  const {
    usePartnersList,
    addProvider,
    removeProvider,
    isAddingProvider,
    isRemovingProvider,
  } = usePartnerQuery();
  const { data: allPartnersData = [] } = usePartnersList({ enabled: isOpen });

  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
  const [partnerToAdd, setPartnerToAdd] = useState<AssociatedPartner | null>(
    null,
  );
  const [partnerToRemove, setPartnerToRemove] =
    useState<AssociatedPartner | null>(null);

  // TODO(v2-backend): no "hosts this provider belongs to" endpoint (v1
  // GET /providers/{id}/partners); only GET /hosts/{id}/providers per host.
  const associatedPartners: AssociatedPartner[] = useMemo(() => [], []);

  const availablePartners: AssociatedPartner[] = useMemo(
    () =>
      allPartnersData.map((p: Partner) => ({
        id: String(p.id),
        name: p.name,
        logo: p.logo,
        isAssociated: false,
      })),
    [allPartnersData],
  );

  const filteredAvailablePartners = useMemo(() => {
    if (!partnerSearchQuery.trim()) return availablePartners;
    const query = partnerSearchQuery.toLowerCase();
    return availablePartners.filter((partner) =>
      partner.name.toLowerCase().includes(query),
    );
  }, [availablePartners, partnerSearchQuery]);

  const targetId = () => String(provider?.id || providerId);

  const handleAddPartner = async (partner: AssociatedPartner) => {
    if (provider?.applicationStatus !== "APPROVED") {
      // The backend answers 422 PROVIDER_NOT_APPROVED; say it up front.
      toast.error("Only approved providers can be added to a partner");
      setPartnerToAdd(null);
      return;
    }
    await addProvider({
      partnerId: String(partner.id),
      providerId: targetId(),
    });
    await invalidateProvider(targetId());
    setPartnerToAdd(null);
  };

  const handleRemovePartner = async (partner: AssociatedPartner) => {
    await removeProvider({
      partnerId: String(partner.id),
      providerId: targetId(),
    });
    await invalidateProvider(targetId());
    setPartnerToRemove(null);
  };

  return {
    associatedPartners,
    availablePartners,
    filteredAvailablePartners,
    partnerSearchQuery,
    setPartnerSearchQuery,
    partnerToAdd,
    setPartnerToAdd,
    partnerToRemove,
    setPartnerToRemove,
    handleAddPartner,
    handleRemovePartner,
    isAddingPartner: isAddingProvider,
    isRemovingPartner: isRemovingProvider,
  };
};
