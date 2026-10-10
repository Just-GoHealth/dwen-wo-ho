"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/shared/auth";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { hasValidToken } from "@/lib/utils/auth/get-user-type";

const emptySubscribe = () => () => {};

const readHasAuth = () => hasValidToken();

export default function useProviderDashboardAuth() {
  // SSR-safe read of the session hint without a mount effect (avoids hydration
  // mismatch: server renders false, client reads localStorage after hydration).
  const hasAuth = useSyncExternalStore(
    emptySubscribe,
    readHasAuth,
    () => false,
  );

  const { data: authProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: [QUERY_KEYS.auth, QUERY_KEYS.profile],
    queryFn: authService.getProfile,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: hasAuth,
    refetchInterval: (query) => {
      if (!hasAuth) return false;
      const status =
        query.state.data?.applicationStatus ?? query.state.data?.status;
      return status && status !== "APPROVED" ? 5000 : false;
    },
  });

  useEffect(() => {
    if (!authProfile) {
      return;
    }

    const providerId =
      authProfile.id || authProfile.providerId || authProfile.email;

    if (providerId && typeof providerId === "string") {
      localStorage.setItem("providerId", providerId);
    }
  }, [authProfile]);

  const applicationStatus =
    authProfile?.applicationStatus ?? authProfile?.status;

  return {
    isApproved: applicationStatus === "APPROVED",
    isLoading: hasAuth && isProfileLoading,
    authProfile,
  };
}
