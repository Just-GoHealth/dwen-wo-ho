"use client";

import { Suspense } from "react";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { BaseSignInForm } from "@/components/auth/base-sign-in-form";
import { useProviderSignIn } from "@/hooks/auth/use-provider-signin";
import { ProviderSignInProps } from "@/lib/types/components/provider/auth";
import { SIGN_IN_TEXTS } from "@/lib/constants/components/provider/auth/auth-copy";

const SignInContent = (props: ProviderSignInProps) => {
  const audience = props.audience ?? "provider";
  const {
    register,
    onSubmit,
    errors,
    isLoading,
    isRecovering,
    handleRecoverAccount,
    apiError,
    secondsLeft,
  } = useProviderSignIn({
    email: props.email,
    role: audience === "curator" ? "CURATOR" : "PROVIDER",
    onForgotPassword: props.onForgotPassword,
  });

  return (
    <div className="flex h-full min-h-screen flex-col">
      <BaseSignInForm
        audience={audience}
        email={props.email}
        register={register}
        errors={errors}
        onSubmit={onSubmit}
        onBack={props.onBack}
        onForgotPassword={props.onForgotPassword}
        onRecoverAccount={handleRecoverAccount}
        isLoading={isLoading}
        isRecovering={isRecovering}
        successMessage={props.successMessage}
        apiError={apiError}
        secondsLeft={secondsLeft}
      />

      <LoadingOverlay
        text={SIGN_IN_TEXTS.loading.signingIn}
        isVisible={isLoading}
      />
    </div>
  );
};

const ProviderSignIn = (props: ProviderSignInProps) => {
  return (
    <Suspense fallback={<div>{SIGN_IN_TEXTS.loading.loading}</div>}>
      <SignInContent key={props.email} {...props} />
    </Suspense>
  );
};

export default ProviderSignIn;
