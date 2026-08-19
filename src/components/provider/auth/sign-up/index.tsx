"use client";

import { Suspense, type ReactNode } from "react";
import { useHydrated } from "@/hooks/shared/use-hydrated";
import { Logo } from "@/components/shared/logo";
import CreateAccount from "../signup/create-account";
import SignUpVerification from "../signup/sign-up-verification";
import SignUpProfile from "../signup/sign-up-profile";
import { ProviderSignUpFooter } from "../signup/provider-sign-up-footer";
import { ProviderSignUpProps } from "@/lib/types/components/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { useProviderSignUp } from "@/hooks/components/provider/auth/sign-up/use-sign-up";
import { useSignUpProfile } from "@/hooks/components/provider/auth/signup/sign-up-profile";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

const SignUpContent = (props: ProviderSignUpProps) => {
  const { specialty, profileImage } = props;
  const {
    currentStep,
    agreedToTerms,
    setAgreedToTerms,
    isFormValid,
    setIsFormValid,
    signUpData,
    handleCreateAccountNext,
    handleVerificationNext,
    handleBack,
    getCurrentStepLabel,
    isResumeLocked,
    isCheckingGuard,
    profileStep,
  } = useProviderSignUp(props);
  const { theme } = useTheme();
  const mounted = useHydrated();

  const profileFlow = useSignUpProfile({
    email: signUpData.email,
    fullName: signUpData.fullName,
    title: signUpData.title,
    password: signUpData.password,
    specialty,
    profileImage,
    onBack: isResumeLocked ? undefined : () => handleBack(),
    startStep: profileStep ?? 0,
    isResumeLocked,
  });

  let stepContent: ReactNode = null;
  switch (currentStep) {
    case "create":
      stepContent = (
        <CreateAccount
          email={signUpData.email}
          fullName={signUpData.fullName}
          title={signUpData.title}
          agreedToTerms={agreedToTerms}
          onAgreedToTermsChange={setAgreedToTerms}
          onNext={handleCreateAccountNext}
          onValidityChange={setIsFormValid}
        />
      );
      break;

    case "verify":
      stepContent = (
        <SignUpVerification
          email={signUpData.email}
          onNext={handleVerificationNext}
        />
      );
      break;

    case "profile":
      stepContent = (
        <SignUpProfile
          currentStep={profileFlow.currentStep}
          profileData={profileFlow.profileData}
          onFieldChange={profileFlow.handleChange}
        />
      );
      break;
  }

  return (
    <div className="bg-app-gradient text-foreground relative flex min-h-screen flex-col">
      {isCheckingGuard && (
        <div className="bg-background/80 animate-in fade-in absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm duration-300">
          <div className="space-y-4 text-center">
            <div className="border-primary mx-auto size-12 animate-spin rounded-full border-b-2" />
            <p className="text-muted-foreground animate-pulse font-medium">
              {SIGN_UP_TEXTS.resume.checking}
            </p>
          </div>
        </div>
      )}

      <div
        className={`flex min-h-screen flex-1 flex-col transition-opacity duration-300 ease-in-out ${
          isCheckingGuard ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <header className="border-border/50 bg-background/80 sticky top-0 z-50 w-full shrink-0 border-b backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
            <Logo variant={mounted && theme === "light" ? "black" : "white"} />
            <p className="hidden text-xl font-semibold sm:block">
              <span className="text-muted-foreground mr-2 text-sm font-normal">
                {SIGN_UP_TEXTS.header.for}
              </span>
              {SIGN_UP_TEXTS.header.providers}
            </p>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {stepContent}
        </main>

        {currentStep === "profile" ? (
          <ProviderSignUpFooter
            mode="profile"
            profileStep={profileFlow.currentStep}
            onBack={profileFlow.handleBack}
            hideBack={profileFlow.hideBackAtRoot ?? false}
            onNext={profileFlow.handleNext}
            isSubmitting={profileFlow.isSubmitting}
            nextDisabled={!profileFlow.isCurrentStepValid}
          />
        ) : (
          <ProviderSignUpFooter
            mode="main"
            mainStep={currentStep}
            onBack={handleBack}
            backDisabled={isResumeLocked && currentStep !== "create"}
            stepLabel={getCurrentStepLabel()}
            showNext={currentStep === "create"}
            nextDisabled={!agreedToTerms || !isFormValid}
          />
        )}
      </div>
    </div>
  );
};

const ProviderSignUp = (props: ProviderSignUpProps) => {
  return (
    <Suspense
      fallback={
        <div className="bg-app-gradient flex h-screen w-full items-center justify-center">
          <Loader2 className="text-primary size-8 animate-spin" />
        </div>
      }
    >
      <SignUpContent {...props} />
    </Suspense>
  );
};

export default ProviderSignUp;
