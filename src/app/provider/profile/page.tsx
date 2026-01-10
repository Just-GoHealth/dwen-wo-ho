"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/constants/routes";

const ProviderProfile = () => {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to home page
    router.replace(ROUTES.provider.home);
  }, [router]);

  return null;
};

export default ProviderProfile;