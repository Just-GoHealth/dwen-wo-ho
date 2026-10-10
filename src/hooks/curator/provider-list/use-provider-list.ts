"use client";

import { useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { curatorProvidersService } from "@/services/curator/providers";
import { formatProviderName } from "@/lib/utils/shared/provider-name";
import { ProviderDetails } from "@/lib/types/entities/provider";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { toast } from "sonner";

async function fetchProviderDetails(email: string): Promise<ProviderDetails> {
  const result = await curatorProvidersService.getProvider(email);
  if (result) return result;
  throw new Error("Failed to load provider details");
}

export function useCuratorProviderList(
  email: string,
  isAuthenticated: boolean | null,
) {
  const tryFallbackData = useCallback((): ProviderDetails | null => {
    if (typeof window !== "undefined") {
      const fallbackDataStr = sessionStorage.getItem(`provider_${email}`);
      if (fallbackDataStr) {
        try {
          const fallbackData = JSON.parse(fallbackDataStr);
          return {
            id: fallbackData.email || "",
            email: fallbackData.email || "",
            fullName: formatProviderName(
              fallbackData.providerName || "",
              fallbackData.providerTitle,
            ),
            providerTitle: fallbackData.providerTitle || undefined,
            professionalTitle: fallbackData.specialty || "",
            officePhoneNumber: fallbackData.officePhoneNumber || undefined,
            applicationStatus:
              (fallbackData.applicationStatus as
                "PENDING" | "APPROVED" | "REJECTED") || "PENDING",
            status:
              (fallbackData.applicationStatus as
                "PENDING" | "APPROVED" | "REJECTED") || "PENDING",
            profilePhotoURL: fallbackData.profilePhotoURL || undefined,
            createdAt: fallbackData.applicationDate || new Date().toISOString(),
            updatedAt: fallbackData.applicationDate || new Date().toISOString(),
          };
        } catch {
          // ignore
        }
      }
    }
    return null;
  }, [email]);

  const {
    data: providerData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.curatorProviderDetails, email],
    queryFn: () => fetchProviderDetails(email),
    enabled: isAuthenticated === true && !!email,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  // Use fallback data if query returned no data
  const provider = providerData ?? tryFallbackData();

  // Toast on error — reactive effect driven by query status, not callbacks.
  const hasFallback = useCallback(
    () =>
      typeof window !== "undefined" &&
      !!sessionStorage.getItem(`provider_${email}`),
    [email],
  );

  useEffect(() => {
    if (isError && !hasFallback()) {
      toast.error("Failed to load provider details. Please try again.");
    }
  }, [isError, hasFallback]);

  // Clear sessionStorage on successful fetch.
  useEffect(() => {
    if (providerData && typeof window !== "undefined") {
      sessionStorage.removeItem(`provider_${email}`);
    }
  }, [providerData, email]);

  return {
    provider,
    isLoading,
  };
}
