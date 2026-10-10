"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/infra/routes";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import {
  hasValidToken,
  getStoredUserType,
} from "@/lib/utils/auth/get-user-type";
import { useCuratorSummary } from "@/hooks/queries/use-curator";

export function useCuratorLayout() {
  const router = useRouter();
  const { logout } = useAuthQuery();

  const { data: summary } = useCuratorSummary();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  // Client-side guard kept intentionally: auth state lives in localStorage, which
  // is unavailable to Next.js middleware / server redirects, so this check must
  // run in the browser after mount.
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      if (!hasValidToken() || getStoredUserType() !== "curator") {
        router.replace(ROUTES.curator.auth);
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    logout(ROUTES.curator.auth);
  }, [logout]);

  return {
    mounted,
    isAuthenticated,
    schoolCount: summary?.schoolCount ?? 0,
    providerCount: summary?.providerCount ?? 0,
    partnerCount: summary?.partnerCount ?? 0,
    handleLogout,
  };
}
