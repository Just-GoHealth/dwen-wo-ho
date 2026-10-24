"use client";

import { useMemo } from "react";
import { useProvidersQuery } from "@/hooks/queries/use-provider";
import { ProviderDetails } from "@/lib/types/entities/provider";
import {
  formatProviderName,
  getProviderTitle,
} from "@/lib/utils/shared/provider-name";

export const useProviderPanelData = (
  providerId: string,
  providerProp: ProviderDetails | undefined,
) => {
  const { useProvider, invalidateProvider } = useProvidersQuery({
    enabled: false,
  });

  // GET /providers/{id}: the full profile (adapted to ProviderDetails).
  const { data: providerData, isLoading: isQueryLoading } =
    useProvider(providerId);

  const provider: ProviderDetails | null = useMemo(() => {
    const data = providerData ?? providerProp;
    if (!data) return null;
    const name = data.providerName || data.fullName || "";
    return {
      ...data,
      fullName: data.fullName || formatProviderName(name, data.providerTitle),
      providerTitle: getProviderTitle(name, data.providerTitle) || undefined,
      professionalTitle: data.specialty || "",
      profileImage: data.profilePhotoURL || undefined,
      specialties:
        data.specialties ?? (data.specialty ? [data.specialty] : undefined),
    } as ProviderDetails;
  }, [providerData, providerProp]);

  return { provider, isQueryLoading, invalidateProvider };
};
