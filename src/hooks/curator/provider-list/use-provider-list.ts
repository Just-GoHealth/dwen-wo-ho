"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  curatorProvidersService,
  fromProviderProfile,
} from "@/services/curator/providers";
import { ProviderDetails } from "@/lib/types/entities/provider";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { curatorErrorMessage } from "@/lib/v2/curator/errors";
import { toast } from "sonner";

async function fetchProviderDetails(
  providerId: string,
): Promise<ProviderDetails> {
  return fromProviderProfile(
    await curatorProvidersService.getProvider(providerId),
  );
}

export function useCuratorProviderList(
  providerId: string,
  isAuthenticated: boolean | null,
) {
  const {
    data: provider,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.curatorProviderDetails, providerId],
    queryFn: () => fetchProviderDetails(providerId),
    enabled: isAuthenticated === true && !!providerId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  // Toast on error — reactive effect driven by query status, not callbacks.
  useEffect(() => {
    if (isError) {
      toast.error(
        curatorErrorMessage(
          error,
          "Failed to load provider details. Please try again.",
        ),
      );
    }
  }, [isError, error]);

  return {
    provider: provider ?? null,
    isLoading,
    refetch,
  };
}
