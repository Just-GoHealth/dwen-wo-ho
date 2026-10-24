"use client";

import { useEffect, useRef, useState } from "react";
import { firstMissingStep } from "@/lib/utils/provider/profile-patch";
import type { ProviderProfile } from "@/lib/v2/types";

/** Opens on the first step that still has a missing field. */
export const useProfileSteps = (profile: ProviderProfile | undefined) => {
  const [currentStep, setCurrentStep] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!profile || startedRef.current) return;
    startedRef.current = true;
    setCurrentStep(firstMissingStep(profile.missing) ?? 0);
  }, [profile]);

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((step) => step - 1);
  };

  return {
    currentStep,
    setCurrentStep,
    handleBack,
    hideBackAtRoot: currentStep === 0,
  };
};
