"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useProviderMe } from "@/hooks/queries/use-provider-me";
import { ROUTES } from "@/lib/constants/infra/routes";
import { routeForProviderNext } from "@/lib/utils/auth/provider-next-route";
import { ProviderProfileData } from "@/lib/types/components/provider/auth";
import type { ProviderProfile } from "@/lib/v2/types";

const toProfileData = (profile: ProviderProfile): ProviderProfileData => ({
  photo: profile.photo?.url ?? null,
  phoneNumber: profile.phone ?? "",
  bio: profile.slogan ?? "",
  specialty: profile.roleGroups[0]?.id ?? "",
});

/** The form state, seeded from `GET /providers/me` (and re-seeded on STALE). */
export const useProfileData = (enabled: boolean) => {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useProviderMe({ enabled });
  const [profileData, setProfileData] = useState<ProviderProfileData>({
    photo: null,
    phoneNumber: "",
    bio: "",
    specialty: "",
  });
  const seededRef = useRef(false);

  useEffect(() => {
    if (!profile || seededRef.current) return;
    seededRef.current = true;
    setProfileData(toProfileData(profile));
  }, [profile]);

  // Setup only makes sense signed in with `next: PROFILE_SETUP`.
  useEffect(() => {
    if (!enabled) return;
    if (isError) {
      router.replace(ROUTES.provider.signIn as Route);
    } else if (profile && profile.next !== "PROFILE_SETUP") {
      router.replace(routeForProviderNext(profile.next) as Route);
    }
  }, [enabled, isError, profile, router]);

  const handleChange = (
    property: keyof ProviderProfileData,
    value: string | null,
  ) => {
    setProfileData((prev) => ({ ...prev, [property]: value ?? "" }));
  };

  const resetFrom = useCallback((fresh: ProviderProfile) => {
    setProfileData(toProfileData(fresh));
  }, []);

  return {
    profile,
    profileData,
    handleChange,
    resetFrom,
    isLoading: enabled && isLoading,
  };
};
