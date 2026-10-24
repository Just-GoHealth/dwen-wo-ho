"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { useApiError } from "@/hooks/shared/use-api-error";
import { SignUpVerificationProps } from "@/lib/types/components/provider/auth";
import {
  OTP_INPUT_FOCUS_DELAY_MS,
  SIGN_UP_TEXTS,
} from "@/lib/constants/components/provider/auth/signup";
import { CODE_SENT_TEXT } from "@/lib/constants/components/provider/auth/auth-copy";

const RESEND_SECONDS = 60;

/** `POST /auth/verify {purpose: SIGN_UP}` answers `{me}` and signs in. */
export const useSignUpVerification = ({
  email,
  onVerified,
}: SignUpVerificationProps) => {
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const { verifyMutation, sendCodeMutation } = useAuthQuery();
  const apiError = useApiError();

  useEffect(() => {
    if (verifyMutation.isPending) return;
    const timer = setTimeout(
      () => otpInputRef.current?.focus(),
      OTP_INPUT_FOCUS_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [verifyMutation.isPending]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const handleOTPComplete = async (code: string) => {
    apiError.clear();
    try {
      const { me } = await verifyMutation.mutateAsync({
        contact: email.trim(),
        role: "PROVIDER",
        purpose: "SIGN_UP",
        code,
      });
      if (!me) return;
      toast.success(SIGN_UP_TEXTS.toasts.verified);
      onVerified(me);
    } catch (error) {
      apiError.capture(error);
    }
  };

  const handleResendCode = async () => {
    apiError.clear();
    try {
      await sendCodeMutation.mutateAsync({
        contact: email.trim(),
        role: "PROVIDER",
        purpose: "SIGN_UP",
      });
      toast.success(CODE_SENT_TEXT);
      setSeconds(RESEND_SECONDS);
    } catch (error) {
      const described = apiError.capture(error);
      if (described.code === "RATE_LIMITED") {
        setSeconds(Math.max(1, described.retryAfter ?? RESEND_SECONDS));
      }
    }
  };

  return {
    seconds,
    isVerifying: verifyMutation.isPending,
    isResending: sendCodeMutation.isPending,
    apiError: apiError.error,
    handleOTPComplete,
    handleResendCode,
    otpInputRef,
  };
};
