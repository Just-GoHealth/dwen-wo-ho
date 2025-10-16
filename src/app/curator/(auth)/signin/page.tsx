"use client";

import { useState } from "react";
import CheckEmail from "@/components/curator/ui/check-email";
import SignIn from "@/components/curator/ui/signin";

type AuthStep = "check-email" | "sign-in";

const CuratorAuthPage = () => {
  const [step, setStep] = useState<AuthStep>("check-email");
  const [email, setEmail] = useState<string>("");

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("sign-in");
  };

  const handleBackToEmail = () => {
    setStep("check-email");
  };

  return step === "check-email" ? (
    <CheckEmail onEmailSubmit={handleEmailSubmit} />
  ) : (
    <SignIn email={email} onBack={handleBackToEmail} />
  );
};

export default CuratorAuthPage;
