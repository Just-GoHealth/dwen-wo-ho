"use client";

import { useState, Suspense, useEffect } from "react";
import JustGoHealth from "@/components/logo-purple";
import { Button } from "@/components/ui/button";
import Stepper from "@/components/stepper";
import { signUpSteps } from "@/lib/utils";
import CreateAccount from "./signup/create-account";
import SignUpVerification from "./signup/sign-up-verification";
import SignUpProfile from "./signup/sign-up-profile";

interface ProviderSignUpProps {
  email?: string;
  fullName?: string;
  title?: string;
  specialty?: string;
  profileImage?: string;
  isPending?: boolean;
  onBack?: () => void;
  profileStep: number | null;
}

type SignUpStep = "create" | "verify" | "profile";

const SignUpContent = ({
  email: propEmail,
  fullName: propFullName,
  title: propTitle,
  specialty,
  profileImage,
  isPending,
  onBack,
  profileStep,
}: ProviderSignUpProps) => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("create");
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [signUpData, setSignUpData] = useState({
    email: propEmail || "",
    fullName: propFullName || "",
    title: propTitle || "Dr.",
  });

  const handleCreateAccountNext = (data: {
    email: string;
    fullName: string;
    title: string;
  }) => {
    setSignUpData(data);
    setCurrentStep("verify");
  };

  const handleVerificationNext = () => {
    setCurrentStep("profile");
  };

  const handleBack = () => {
    if (currentStep === "create") {
      onBack?.();
    } else if (currentStep === "verify") {
      setCurrentStep("create");
    } else if (currentStep === "profile") {
      setCurrentStep("verify");
    }
  };

  const getCurrentStepLabel = (): "Create" | "Verify" | "Profile" => {
    switch (currentStep) {
      case "create":
        return "Create";
      case "verify":
        return "Verify";
      case "profile":
        return "Profile";
      default:
        return "Create";
    }
  };

  useEffect(() => {
    if (profileStep == null) return;
    setCurrentStep("profile");
  }, [profileStep]);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "create":
        return (
          <CreateAccount
            email={signUpData.email}
            fullName={signUpData.fullName}
            title={signUpData.title}
            agreedToTerms={agreedToTerms}
            onAgreedToTermsChange={setAgreedToTerms}
            onNext={handleCreateAccountNext}
          />
        );

      case "verify":
        return (
          <SignUpVerification
            email={signUpData.email}

            onNext={handleVerificationNext}
          />
        );

      case "profile":
        return (
          <SignUpProfile
            email={signUpData.email}
            fullName={signUpData.fullName}
            title={signUpData.title}
            specialty={specialty}
            profileImage={profileImage}
            isPending={isPending}
            onBack={() => setCurrentStep("verify")}
            startStep={profileStep || 0}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-8 py-4">
        <JustGoHealth />
        <p className="text-2xl font-bold"><span className="text-sm">for</span> Providers</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-0">
        {renderStepContent()}
      </div>

      {/* Bottom Navigation - Hidden on Profile Step */}
      {currentStep !== "profile" && (
        <div className="flex flex-col sm:flex-row border-t border-gray-500 px-4 sm:px-6 lg:px-6 py-4 items-center justify-between space-y-4 sm:space-y-0 mt-4">
          <Button
            onClick={handleBack}
            className="rounded-full mr-2 px-8 py-1 border-4 bg-white text-[#955aa4] text-lg font-bold border-[#955aa4] uppercase flex items-center justify-center hover:bg-white"
          >
            Back
          </Button>

          <div className="flex-1 flex justify-center">
            <Stepper steps={signUpSteps} step={getCurrentStepLabel()} />
          </div>

          {currentStep === "create" ? (
            <button
              form="create-account-form"
              type="submit"
              disabled={!agreedToTerms}
              className="rounded-full ml-2 px-8 py-1 border-4 text-lg font-bold uppercase transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#955aa4]/80 text-white border-[#955aa4] hover:bg-[#955aa4] disabled:hover:bg-[#955aa4]/80"
            >
              Next
            </button>
          ) : (
            <Button className="invisible rounded-full px-6 py-2 border-2">
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

const ProviderSignUp = (props: ProviderSignUpProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent {...props} />
    </Suspense>
  );
};

export default ProviderSignUp;
