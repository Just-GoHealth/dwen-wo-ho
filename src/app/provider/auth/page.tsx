"use client";

import { useState } from "react";
import CheckEmail from "@/components/provider/ui/check-email";
import SignIn from "@/components/provider/ui/signin";
import SignUp from "@/components/provider/ui/sign-up";

type AuthStep = "check-email" | "sign-in" | "sign-up";
import { useRouter } from "next/navigation";

const ProviderAuthPage = () => {
  const [step, setStep] = useState<AuthStep>("sign-up");
  const [email, setEmail] = useState<string>("asare4ster@gmail.com");

  const router = useRouter();
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
    <SignUp email={email} onBack={handleBackToEmail} />
  );
};

export default ProviderAuthPage;
