"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { ProviderSignUpProps } from "@/lib/types/components/provider/auth";
import { routeForMe } from "@/lib/utils/auth/provider-next-route";
import type { Me } from "@/lib/v2/types";

type SignUpStep = "create" | "verify" | "profile";

/**
 * create (`POST /auth/provider/sign-up`, 202) → verify (`SIGN_UP` code signs
 * in) → profile setup while `next` is PROFILE_SETUP. A signed-in provider
 * resuming setup lands straight on `profile`.
 */
export const useProviderSignUp = ({
  email: propEmail,
  fullName: propFullName,
  title: propTitle,
  onBack,
  startOnProfile,
}: ProviderSignUpProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SignUpStep>(
    startOnProfile ? "profile" : "create",
  );
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [signUpData, setSignUpData] = useState({
    email: propEmail || "",
    fullName: propFullName || "",
    title: propTitle || "",
  });

  const handleCreateAccountNext = (data: {
    email: string;
    fullName: string;
    title: string;
  }) => {
    setSignUpData(data);
    setCurrentStep("verify");
  };

  const handleVerified = (me: Me) => {
    if (me.role === "PROVIDER" && me.next === "PROFILE_SETUP") {
      setCurrentStep("profile");
      return;
    }
    router.replace(routeForMe(me) as Route);
  };

  const handleBack = () => {
    if (currentStep === "create") onBack?.();
    else if (currentStep === "verify") setCurrentStep("create");
    // Profile setup happens signed in; there's no going back to verify.
  };

  const getCurrentStepLabel = (): "Create" | "Verify" | "Profile" =>
    currentStep === "verify"
      ? "Verify"
      : currentStep === "profile"
        ? "Profile"
        : "Create";

  return {
    currentStep,
    agreedToTerms,
    setAgreedToTerms,
    isFormValid,
    setIsFormValid,
    signUpData,
    handleCreateAccountNext,
    handleVerified,
    handleBack,
    getCurrentStepLabel,
  };
};
