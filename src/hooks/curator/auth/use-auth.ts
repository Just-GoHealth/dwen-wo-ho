"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/infra/routes";
import { getStoredUserType } from "@/lib/utils/auth/get-user-type";

export function useCuratorAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    if (typeof window !== "undefined") {
      return getStoredUserType() === "curator";
    }
    return null;
  });

  // Client-side guard kept intentionally: the session hint (userType) lives in
  // localStorage, which is unavailable to Next.js middleware / server
  // redirects, so this check must run in the browser after mount. The session
  // itself is verified by the first API call (refresh from the HttpOnly
  // cookie, or logout if that fails).
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (getStoredUserType() !== "curator") {
        router.replace(ROUTES.curator.auth);
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
    }
  }, [router]);

  return { isAuthenticated, router };
}
