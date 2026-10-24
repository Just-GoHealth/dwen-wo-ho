"use client";

import { ProviderProfileStep } from "@/lib/types/components/provider/auth";
import { isProviderProfileStepValid } from "@/lib/utils/provider/profile-validation";
import { useProfileData } from "./use-profile-data";
import { useProfileSteps } from "./use-profile-steps";
import { useProfileActions } from "./use-profile-actions";

/**
 * Profile setup, driven by `missing[]` from `GET /providers/me`. There is no
 * submit call: the save that fills the last required field moves the
 * provider to PENDING, and we route by the returned `next`.
 */
export const useSignUpProfile = ({ enabled }: { enabled: boolean }) => {
  const { profile, profileData, handleChange, isLoading, resetFrom } =
    useProfileData(enabled);

  const { currentStep, setCurrentStep, handleBack, hideBackAtRoot } =
    useProfileSteps(profile);

  const { isSubmitting, handleNext, fieldError } = useProfileActions({
    profileData,
    currentStep,
    setCurrentStep,
    onStale: resetFrom,
  });

  const isCurrentStepValid = isProviderProfileStepValid(
    currentStep as ProviderProfileStep,
    profileData,
  );

  return {
    currentStep,
    isLoading,
    isSubmitting,
    profileData,
    handleChange,
    handleBack,
    handleNext,
    fieldError,
    isCurrentStepValid,
    hideBackAtRoot,
  };
};
