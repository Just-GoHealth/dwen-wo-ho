"use client";

import { useState } from "react";
import CheckEmail from "@/components/provider/ui/check-email";
import SignIn from "@/components/provider/ui/signin";
import SignUp from "@/components/provider/ui/sign-up";
import VerifyPasswordReset from "@/components/provider/ui/verify-password-reset";

type AuthStep = "check-email" | "sign-in" | "sign-up" | "reset-password";

const ProviderAuthPage = () => {
  const [step, setStep] = useState<AuthStep>("check-email");
  const [email, setEmail] = useState<string>("asare4ster@gmail.com");

  // This state is only used when there is an error during login because profile is incomplete
  const [profileStep, setProfileStep] = useState<number | null>(null);

  const handleEmailSubmit = (submittedEmail: string, emailExists: boolean) => {
    setEmail(submittedEmail);
    if (emailExists) {
      setStep("sign-in");
    } else {
      setStep("sign-up");
    }
  };

  const handleBackToEmail = () => {
    setStep("check-email");
  };

  const handleForgotPassword = () => {
    setStep("reset-password");
  };

  const handleProfileIncomplete = (step: number) => {
    // Handle profile incomplete steps if needed
    setStep("sign-up");
    setProfileStep(step);
  };
  return step === "check-email" ? (
    <CheckEmail onEmailSubmit={handleEmailSubmit} />
  ) : step === "sign-in" ? (
    <SignIn
      email={email}
      onBack={handleBackToEmail}
      onForgotPassword={handleForgotPassword}
      onProfileIncomplete={(step) => handleProfileIncomplete(step)}
    />
  ) : step === "reset-password" ? (
    <VerifyPasswordReset email={email} onBack={() => setStep("sign-in")} />
  ) : (
    <SignUp
      email={email}
      onBack={() => setStep("check-email")}
      profileStep={profileStep}
    />
  );
};

export default ProviderAuthPage;
