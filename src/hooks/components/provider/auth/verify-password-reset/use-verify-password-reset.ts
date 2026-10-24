"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/infra/routes";
import useGetSearchParams from "@/hooks/shared/use-get-search-params";
import { VerifyPasswordResetProps } from "@/lib/types/components/provider/auth";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { useApiError } from "@/hooks/shared/use-api-error";
import { holdGrant } from "@/lib/auth/grant";
import {
  CLAIM_TEXTS,
  CODE_SENT_TEXT,
} from "@/lib/constants/components/provider/auth/auth-copy";
import { OTP_INPUT_FOCUS_DELAY_MS } from "@/lib/constants/components/provider/auth/signup";

const RESEND_SECONDS = 60;

/**
 * The code screen for RECOVERY (forgot password) and CLAIM (an account a
 * curator created). For CLAIM it first sends `POST /auth/claim`; a verified
 * code yields a one-time `grant` that the new-password screen spends on
 * `POST /auth/password`.
 */
export const useVerifyPasswordReset = ({
  email: propEmail,
  role,
  purpose,
  onBack,
}: VerifyPasswordResetProps) => {
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const searchParamEmail = useGetSearchParams("email");
  const email = (propEmail || searchParamEmail || "").trim();
  const router = useRouter();
  const { verifyMutation, sendCodeMutation, claimMutation } = useAuthQuery();
  const apiError = useApiError();
  const claimSentRef = useRef(false);

  // CLAIM starts here: ask for the first code once.
  useEffect(() => {
    if (purpose !== "CLAIM" || claimSentRef.current || !email) return;
    claimSentRef.current = true;
    claimMutation
      .mutateAsync({ email, role })
      .then(() => toast.success(CODE_SENT_TEXT))
      .catch((error) => {
        const described = apiError.capture(error);
        if (described.code === "ALREADY_CLAIMED") {
          toast.info(CLAIM_TEXTS.alreadyClaimed);
          router.replace(
            `${ROUTES.provider.signIn}&email=${encodeURIComponent(email)}`,
          );
        }
      });
  }, [apiError, claimMutation, email, purpose, role, router]);

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
      const res = await verifyMutation.mutateAsync({
        contact: email,
        role,
        purpose,
        code,
      });
      if (!res.grant) return;
      holdGrant({ grant: res.grant, email, role, purpose });
      router.push(
        `${ROUTES.provider.newPassword}?email=${encodeURIComponent(email)}`,
      );
    } catch (error) {
      apiError.capture(error);
    }
  };

  const handlePasswordResetResendCode = async () => {
    apiError.clear();
    try {
      await sendCodeMutation.mutateAsync({ contact: email, role, purpose });
      toast.success(CODE_SENT_TEXT);
      setSeconds(RESEND_SECONDS);
    } catch (error) {
      const described = apiError.capture(error);
      if (described.code === "RATE_LIMITED") {
        setSeconds(Math.max(1, described.retryAfter ?? RESEND_SECONDS));
      }
    }
  };

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return {
    seconds,
    email,
    otpInputRef,
    isVerifying: verifyMutation.isPending,
    isResending: sendCodeMutation.isPending || claimMutation.isPending,
    apiError: apiError.error,
    handleOTPComplete,
    handlePasswordResetResendCode,
    handleBack,
  };
};
