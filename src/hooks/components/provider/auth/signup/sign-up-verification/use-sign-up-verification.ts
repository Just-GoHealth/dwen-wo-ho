"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { toast } from "sonner";
import { SignUpVerificationProps } from "@/lib/types/components/provider/auth";
import { getCleanErrorMessage } from "@/lib/utils/auth/error";
import { applyProviderAuthTokens } from "@/lib/utils/auth/provider-tokens";
import { buildProviderSignupResumeUrl } from "@/lib/utils/provider/signup-resume";
import {
  OTP_INPUT_FOCUS_DELAY_MS,
  SIGN_UP_TEXTS,
} from "@/lib/constants/components/provider/auth/signup";

export const useSignUpVerification = ({
  email,
  onNext,
}: SignUpVerificationProps) => {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(60);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const { verifyEmailMutation, resendSignupVerificationMutation } =
    useAuthQuery();

  useEffect(() => {
    if (verifyEmailMutation.isPending) return;

    const timer = setTimeout(() => {
      otpInputRef.current?.focus();
    }, OTP_INPUT_FOCUS_DELAY_MS);

    return () => clearTimeout(timer);
  }, [verifyEmailMutation.isPending]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, seconds]);

  const handleOTPComplete = async (value: string) => {
    try {
      const verifyResponse = await verifyEmailMutation.mutateAsync({
        code: value,
        email: email.trim(),
      });

      if (verifyResponse) {
        const token = verifyResponse.token;

        if (token) {
          // Access token in memory only; any refresh token was moved into an
          // HttpOnly cookie by the submit-signup-code route handler.
          applyProviderAuthTokens({ token });
          toast.success(SIGN_UP_TEXTS.toasts.verified);
          router.replace(
            buildProviderSignupResumeUrl(email.trim(), "photo") as Route,
          );
          onNext();
        } else {
          toast.error(SIGN_UP_TEXTS.errors.noToken);
        }
      }
    } catch (error: unknown) {
      const errorMsg =
        getCleanErrorMessage(error) || SIGN_UP_TEXTS.errors.verifyFailed;
      toast.error(errorMsg);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendSignupVerificationMutation.mutateAsync({ email });
      setSeconds(60);
      setIsRunning(true);
    } catch (error: unknown) {
      const errorMsg =
        getCleanErrorMessage(error) || SIGN_UP_TEXTS.errors.resendFailed;
      toast.error(errorMsg);
    }
  };

  return {
    seconds,
    verifyEmailMutation,
    resendSignupVerificationMutation,
    handleOTPComplete,
    handleResendCode,
    otpInputRef,
  };
};
