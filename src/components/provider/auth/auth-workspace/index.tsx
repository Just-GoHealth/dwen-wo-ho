"use client";

import { Suspense, type ReactNode } from "react";
import CheckEmail from "@/components/provider/auth/check-email/index";
import SignIn from "@/components/provider/auth/signin/index";
import SignUp from "@/components/provider/auth/sign-up/index";
import VerifyPasswordReset from "@/components/provider/auth/verify-password-reset/index";
import { useProviderAuth } from "@/hooks/provider/auth/use-auth";
import { SIGN_IN_TEXTS } from "@/lib/constants/components/provider/auth/auth-copy";

function ProviderAuthPageContent() {
  const {
    step,
    email,
    passwordResetSuccess,
    isCheckingAuth,
    profileStep,
    handleEmailSubmit,
    handleBackToEmail,
    handleForgotPassword,
    handleProfileIncomplete,
    handleBackToSignIn,
    handleBackToCheckEmail,
  } = useProviderAuth();

  let authContent: ReactNode;
  switch (step) {
    case "check-email":
      authContent = <CheckEmail onEmailSubmit={handleEmailSubmit} />;
      break;
    case "sign-in":
      authContent = (
        <SignIn
          email={email}
          successMessage={
            passwordResetSuccess
              ? SIGN_IN_TEXTS.success.passwordReset
              : undefined
          }
          onBack={handleBackToEmail}
          onForgotPassword={handleForgotPassword}
          onProfileIncomplete={(step) => handleProfileIncomplete(step)}
        />
      );
      break;
    case "reset-password":
      authContent = (
        <VerifyPasswordReset email={email} onBack={handleBackToSignIn} />
      );
      break;
    default:
      authContent = (
        <SignUp
          email={email}
          onBack={handleBackToCheckEmail}
          profileStep={profileStep}
        />
      );
  }

  return (
    <div className="bg-app-gradient relative min-h-screen w-full transition-colors duration-300">
      {isCheckingAuth && (
        <div className="bg-background/80 animate-in fade-in absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm duration-300">
          <div className="space-y-4 text-center">
            <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2" />
            <p className="text-muted-foreground animate-pulse font-medium">
              Checking authentication...
            </p>
          </div>
        </div>
      )}

      <div
        className={`transition-opacity duration-500 ease-in-out ${
          isCheckingAuth ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {authContent}
      </div>
    </div>
  );
}

export function ProviderAuthWorkspace() {
  return (
    <Suspense
      fallback={
        <div className="bg-app-gradient flex h-screen w-full items-center justify-center">
          <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2" />
        </div>
      }
    >
      <ProviderAuthPageContent />
    </Suspense>
  );
}
