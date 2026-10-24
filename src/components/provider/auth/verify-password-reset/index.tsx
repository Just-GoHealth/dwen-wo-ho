"use client";

import Link from "next/link";

import { Logo } from "@/components/shared/logo";

import { Button } from "@/components/ui/button";

import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";

import { LoadingButton } from "@/components/ui/loading-button";

import { Spinner } from "@/components/ui/spinner";

import { Suspense } from "react";
import { useHydrated } from "@/hooks/shared/use-hydrated";

import { formatElapsedSeconds as formatTime } from "@/lib/utils/shared/time-ago";
import { RECOVER_STEPS as recoverSteps } from "@/lib/constants/components/shared/auth-flow";

import { ROUTES } from "@/lib/constants/infra/routes";

import Stepper from "@/components/miscellaneous/stepper";

import { ArrowRightIcon } from "lucide-react";

import { VerifyPasswordResetProps } from "@/lib/types/components/provider/auth";

import {
  CLAIM_TEXTS,
  VERIFY_PASSWORD_RESET_TEXTS,
} from "@/lib/constants/components/provider/auth/auth-copy";
import { ApiErrorNote } from "@/components/shared/api-error-note";

import { useVerifyPasswordReset } from "@/hooks/components/provider/auth/verify-password-reset/use-verify-password-reset";

import { useTheme } from "next-themes";

const VerifyContent = (props: VerifyPasswordResetProps) => {
  const {
    seconds,

    email,

    otpInputRef,

    isVerifying,

    isResending,

    apiError,

    handleOTPComplete,

    handlePasswordResetResendCode,

    handleBack,
  } = useVerifyPasswordReset(props);

  const { theme } = useTheme();

  const mounted = useHydrated();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 flex h-full min-h-screen flex-col justify-between py-8 duration-700">
      <div className="relative z-10 flex w-full items-center justify-between px-4 sm:px-8">
        <div className="transform transition-transform duration-300 hover:scale-105">
          <Logo variant={mounted && theme === "light" ? "black" : "white"} />
        </div>

        <Link
          href={ROUTES.provider.auth}
          className="text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-full px-4 py-2 text-sm font-medium transition-colors"
        >
          {VERIFY_PASSWORD_RESET_TEXTS.header.signIn}
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 items-center justify-center md:px-12">
        <div className="w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {props.purpose === "CLAIM"
                ? CLAIM_TEXTS.title
                : VERIFY_PASSWORD_RESET_TEXTS.content.title}
            </h1>

            <p className="text-muted-foreground text-lg">
              {props.purpose === "CLAIM"
                ? CLAIM_TEXTS.subtitle
                : VERIFY_PASSWORD_RESET_TEXTS.content.subtitlePart1}{" "}
              <span className="text-foreground mt-1 block font-semibold">
                {decodeURIComponent(email as string)}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            {isVerifying ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <Spinner className="text-primary size-10" />

                <p className="text-muted-foreground animate-pulse font-medium">
                  {VERIFY_PASSWORD_RESET_TEXTS.content.verifying}
                </p>
              </div>
            ) : (
              <div className="mx-auto flex w-fit flex-col gap-6">
                <InputOTP
                  ref={otpInputRef}
                  maxLength={6}
                  onComplete={handleOTPComplete}
                  containerClassName="gap-2 flex justify-center"
                >
                  <InputOTPSlot
                    index={0}
                    className="border-input bg-muted/30 focus:border-primary focus:ring-primary h-14 w-12 rounded-lg border text-2xl font-bold transition-all duration-200 focus:ring-1"
                  />

                  <InputOTPSlot
                    index={1}
                    className="border-input bg-muted/30 focus:border-primary focus:ring-primary h-14 w-12 rounded-lg border text-2xl font-bold transition-all duration-200 focus:ring-1"
                  />

                  <InputOTPSlot
                    index={2}
                    className="border-input bg-muted/30 focus:border-primary focus:ring-primary h-14 w-12 rounded-lg border text-2xl font-bold transition-all duration-200 focus:ring-1"
                  />

                  <InputOTPSlot
                    index={3}
                    className="border-input bg-muted/30 focus:border-primary focus:ring-primary h-14 w-12 rounded-lg border text-2xl font-bold transition-all duration-200 focus:ring-1"
                  />

                  <InputOTPSlot
                    index={4}
                    className="border-input bg-muted/30 focus:border-primary focus:ring-primary h-14 w-12 rounded-lg border text-2xl font-bold transition-all duration-200 focus:ring-1"
                  />

                  <InputOTPSlot
                    index={5}
                    className="border-input bg-muted/30 focus:border-primary focus:ring-primary h-14 w-12 rounded-lg border text-2xl font-bold transition-all duration-200 focus:ring-1"
                  />
                </InputOTP>

                <LoadingButton
                  variant={seconds > 0 ? "outline" : "default"}
                  loading={isResending}
                  disabled={seconds > 0}
                  onClick={handlePasswordResetResendCode}
                  className="hover:bg-muted/50 h-12 w-full text-base font-medium transition-colors"
                >
                  {seconds > 0 ? (
                    <span className="flex items-center gap-2">
                      Resend code in{" "}
                      <span className="text-primary w-8 font-bold">
                        {formatTime(seconds)}
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {VERIFY_PASSWORD_RESET_TEXTS.content.resendButton}{" "}
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  )}
                </LoadingButton>
                <ApiErrorNote error={apiError} secondsLeft={seconds} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-border flex items-center justify-between border-t px-8 pt-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground group flex items-center gap-2"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>{" "}
          {VERIFY_PASSWORD_RESET_TEXTS.footer.back}
        </Button>

        <div className="hidden sm:block">
          <Stepper steps={recoverSteps} step="Verify" />
        </div>

        <div className="w-24" />
      </div>
    </div>
  );
};

const Verify = (props: VerifyPasswordResetProps) => {
  return (
    <Suspense fallback={<div>{VERIFY_PASSWORD_RESET_TEXTS.loading}</div>}>
      <VerifyContent {...props} />
    </Suspense>
  );
};

export default Verify;
