"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/infra/routes";
import { getStoredUserType } from "@/lib/utils/auth/get-user-type";

export function useCuratorRedirect() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Client-side guard kept intentionally: the session hint (userType) lives in
  // localStorage, which is unavailable to Next.js middleware / server
  // redirects, so this entry-point redirect must run in the browser after mount.
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (getStoredUserType() === "curator") {
      router.replace(ROUTES.curator.schools);
    } else {
      router.replace(ROUTES.curator.auth);
    }

    setIsChecking(false);
  }, [router]);

  return { isChecking };
}
