"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { toast } from "sonner";
import { usePatchProviderMe } from "@/hooks/queries/use-provider-me";
import { useApiError } from "@/hooks/shared/use-api-error";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { validateProviderProfileStep } from "@/lib/utils/provider/profile-validation";
import {
  firstMissingStep,
  toE164Phone,
} from "@/lib/utils/provider/profile-patch";
import { routeForProviderNext } from "@/lib/utils/auth/provider-next-route";
import { toSentenceCase } from "@/lib/utils/shared/string-case";
import {
  ProviderProfileData,
  ProviderProfileStep,
} from "@/lib/types/components/provider/auth";
import type { ProviderPatchRequest, ProviderProfile } from "@/lib/v2/types";

/**
 * Saves one setup step. The photo step already uploaded on crop, so "Next"
 * only advances; the bio and specialty steps PATCH with `version`. Whatever
 * the save, re-read `next`: leaving PROFILE_SETUP means the application went
 * in, so route away.
 */
export const useProfileActions = ({
  profileData,
  currentStep,
  setCurrentStep,
  onStale,
}: {
  profileData: ProviderProfileData;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onStale: (fresh: ProviderProfile) => void;
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const patchMutation = usePatchProviderMe();
  const apiError = useApiError();

  const afterSave = (profile: ProviderProfile) => {
    if (profile.next !== "PROFILE_SETUP") {
      setIsRedirecting(true);
      router.replace(routeForProviderNext(profile.next) as Route);
      return;
    }
    const nextMissing = firstMissingStep(profile.missing);
    setCurrentStep((step) =>
      nextMissing !== null && nextMissing > step
        ? nextMissing
        : Math.min(step + 1, 2),
    );
  };

  const save = async (changes: Omit<ProviderPatchRequest, "version">) => {
    apiError.clear();
    try {
      const outcome = await patchMutation.mutateAsync(changes);
      if (outcome.kind === "stale") {
        // The reloaded profile is in the cache; show it and let them redo it.
        onStale(outcome.profile);
        return;
      }
      toast.success(SIGN_UP_TEXTS.errors.profileUpdated);
      afterSave(outcome.profile);
    } catch (error) {
      const described = apiError.capture(error);
      if (!described.fieldError("phone") && !described.fieldError("slogan")) {
        toast.error(described.message);
      }
    }
  };

  const handleNext = async () => {
    const stepValidation = validateProviderProfileStep(
      currentStep as ProviderProfileStep,
      profileData,
    );
    if (!stepValidation.isValid) {
      toast.error(stepValidation.error ?? SIGN_UP_TEXTS.errors.fillAllFields);
      return;
    }

    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      await save({
        phone: toE164Phone(profileData.phoneNumber),
        slogan: toSentenceCase(profileData.bio.trim()),
      });
    } else {
      await save({ roleCategoryIds: [profileData.specialty] });
    }
  };

  return {
    isSubmitting: patchMutation.isPending || isRedirecting,
    handleNext,
    fieldError: apiError.fieldError,
  };
};
