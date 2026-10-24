"use client";

import { useState, useMemo } from "react";
import { useCampusOptions } from "@/hooks/curator/providers/use-campus-options";
import { useProvidersQuery } from "@/hooks/queries/use-provider";
import usePartnerQuery from "@/hooks/queries/use-partner";
import { FiUsers } from "react-icons/fi";
import { MdSchool } from "react-icons/md";
import { Handshake } from "lucide-react";
import { usePartnerSearch } from "./use-partner-search";
import { usePartnerAvailability } from "./use-partner-availability";
import { usePartnerPanelState } from "./use-partner-panel-state";
import {
  PartnerDetailsTab,
  AssociatedSchool,
  AssociatedProvider,
  Partner,
} from "@/lib/types/entities/partners";

export const usePartnerDetails = ({
  partnerId,
  partnerProp,
  isOpen,
}: {
  partnerId: string;
  partnerProp: Partner | null | undefined;
  isOpen: boolean;
}) => {
  const { data: allSchools = [] } = useCampusOptions({ enabled: isOpen });
  // Only approved providers can join a host (422 PROVIDER_NOT_APPROVED).
  const { providers } = useProvidersQuery({ enabled: isOpen });
  const providersList = (providers ?? []).filter(
    (p) => p.applicationStatus === "APPROVED",
  );

  const {
    addSchool,
    isAddingSchool,
    removeSchool,
    isRemovingSchool,
    addProvider,
    isAddingProvider,
    removeProvider,
    isRemovingProvider,
    usePartnerFullDetails,
    invalidatePartners,
  } = usePartnerQuery();

  const [activeTab, setActiveTab] = useState<PartnerDetailsTab>("overview");
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [providerSearchQuery, setProviderSearchQuery] = useState("");

  const [schoolToAdd, setSchoolToAdd] = useState<AssociatedSchool | null>(null);
  const [schoolToRemove, setSchoolToRemove] = useState<AssociatedSchool | null>(
    null,
  );
  const [providerToAdd, setProviderToAdd] = useState<AssociatedProvider | null>(
    null,
  );
  const [providerToRemove, setProviderToRemove] =
    useState<AssociatedProvider | null>(null);

  const modalState = usePartnerPanelState();

  const { data: partnerDetails, isLoading: isLoadingDetails } =
    usePartnerFullDetails(partnerId, { enabled: isOpen });

  const partner: Partner | null =
    partnerDetails?.partner ?? partnerProp ?? null;
  const associatedSchools = partnerDetails?.associatedSchools ?? [];
  const associatedProviders = partnerDetails?.associatedProviders ?? [];

  const { availableSchools, availableProviders } = usePartnerAvailability({
    allSchools,
    providersList,
    associatedSchools,
    associatedProviders,
  });

  const { filteredAvailableSchools, filteredAvailableProviders } =
    usePartnerSearch({
      availableSchools,
      availableProviders,
      schoolSearchQuery,
      providerSearchQuery,
    });

  // Reset the modal while rendering when it opens, instead of mirroring the
  // open prop into state via an effect.
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setActiveTab("overview");
      setSchoolSearchQuery("");
      setProviderSearchQuery("");
    }
  }

  const handleAddSchool = async (school: AssociatedSchool) => {
    await addSchool({ partnerId, schoolId: String(school.id) });
    setSchoolToAdd(null);
  };

  const handleRemoveSchool = async (school: AssociatedSchool) => {
    await removeSchool({ partnerId, schoolId: String(school.id) });
    setSchoolToRemove(null);
  };

  const handleAddProvider = async (provider: AssociatedProvider) => {
    await addProvider({ partnerId, providerId: provider.id });
    setProviderToAdd(null);
  };

  const handleRemoveProvider = async (provider: AssociatedProvider) => {
    await removeProvider({ partnerId, providerId: provider.id });
    setProviderToRemove(null);
  };

  const loadPartnerDetails = async () => {
    await invalidatePartners(partnerId);
  };

  const tabs = useMemo(
    () => [
      {
        id: "overview" as PartnerDetailsTab,
        label: "Overview",
        icon: Handshake,
      },
      {
        id: "schools" as PartnerDetailsTab,
        label: "Schools",
        icon: MdSchool,
        count: associatedSchools.length,
      },
      {
        id: "providers" as PartnerDetailsTab,
        label: "Providers",
        icon: FiUsers,
        count: associatedProviders.length,
      },
    ],
    [associatedSchools.length, associatedProviders.length],
  );

  return {
    ...modalState,
    partner,
    activeTab,
    setActiveTab,
    associatedSchools,
    associatedProviders,
    schoolSearchQuery,
    setSchoolSearchQuery,
    providerSearchQuery,
    setProviderSearchQuery,
    schoolToAdd,
    setSchoolToAdd,
    schoolToRemove,
    setSchoolToRemove,
    providerToAdd,
    setProviderToAdd,
    providerToRemove,
    setProviderToRemove,
    isLoadingSchools: isLoadingDetails,
    isLoadingProviders: isLoadingDetails,
    isAddingSchool,
    isRemovingSchool,
    isAddingProvider,
    isRemovingProvider,
    filteredAvailableSchools,
    filteredAvailableProviders,
    handleAddSchool,
    handleRemoveSchool,
    handleAddProvider,
    handleRemoveProvider,
    loadPartnerDetails,
    tabs,
  };
};
