"use client";

import { useMemo } from "react";
import { formatProviderName } from "@/lib/utils/shared/provider-name";
import {
  AssociatedSchool,
  AssociatedProvider,
  UsePartnerSearchProps,
} from "@/lib/types/entities/partners";

export const usePartnerSearch = ({
  availableSchools,
  availableProviders,
  schoolSearchQuery,
  providerSearchQuery,
}: UsePartnerSearchProps) => {
  const filteredAvailableSchools = useMemo(() => {
    if (!schoolSearchQuery.trim()) return availableSchools;
    const query = schoolSearchQuery.toLowerCase();
    return availableSchools.filter((school: AssociatedSchool) =>
      school.name.toLowerCase().includes(query),
    );
  }, [availableSchools, schoolSearchQuery]);

  const filteredAvailableProviders = useMemo(() => {
    if (!providerSearchQuery.trim()) return availableProviders;
    const query = providerSearchQuery.toLowerCase();
    return availableProviders.filter(
      (provider: AssociatedProvider) =>
        formatProviderName(provider.providerName, provider.providerTitle)
          .toLowerCase()
          .includes(query) ||
        provider.email?.toLowerCase().includes(query) ||
        provider.specialty?.toLowerCase().includes(query),
    );
  }, [availableProviders, providerSearchQuery]);

  return {
    filteredAvailableSchools,
    filteredAvailableProviders,
  };
};
