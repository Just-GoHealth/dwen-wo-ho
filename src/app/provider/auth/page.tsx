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

  return step === "check-email" ? (
    <CheckEmail onEmailSubmit={handleEmailSubmit} />
  ) : step === "sign-in" ? (
    <SignIn
      email={email}
      onBack={handleBackToEmail}
      onForgotPassword={handleForgotPassword}
    />
  ) : step === "reset-password" ? (
    <VerifyPasswordReset email={email} onBack={() => setStep("sign-in")} />
  ) : (
    <SignUp email={email} onBack={() => setStep("check-email")} />
  );
};

export default ProviderAuthPage;
