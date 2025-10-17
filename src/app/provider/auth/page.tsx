"use client";

import { useState } from "react";
import CheckEmail from "@/components/provider/ui/check-email";
import SignIn from "@/components/provider/ui/signin";
import SignUp from "@/components/provider/ui/sign-up";

type AuthStep = "check-email" | "sign-in" | "sign-up";

const ProviderAuthPage = () => {
  const [step, setStep] = useState<AuthStep>("sign-up");
  const [email, setEmail] = useState<string>("dead_alnix2@gmail.com");

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

  return step === "check-email" ? (
    <CheckEmail onEmailSubmit={handleEmailSubmit} />
  ) : step == "sign-in" ? (
    <SignIn email={email} onBack={handleBackToEmail} />
  ) : (
    <SignUp email={email} onBack={() => setStep("check-email")} />
  );
};

export default ProviderAuthPage;
