"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/infra/routes";
import { setAccessToken, setRecoveryToken } from "@/lib/auth/access-token";
import useGetSearchParams from "@/hooks/shared/use-get-search-params";
import { VerifyPasswordResetProps } from "@/lib/types/components/provider/auth";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { getCleanErrorMessage } from "@/lib/utils/auth/error";
import { VERIFY_PASSWORD_RESET_TEXTS } from "@/lib/constants/components/provider/auth/auth-copy";
import { OTP_INPUT_FOCUS_DELAY_MS } from "@/lib/constants/components/provider/auth/signup";

export const useVerifyPasswordReset = ({
  email: propEmail,
  onBack,
}: VerifyPasswordResetProps) => {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(60);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const searchParamEmail = useGetSearchParams("email");
  const email = propEmail || searchParamEmail;
  const router = useRouter();
  const {
    resendPasswordResetVerificationMutation,
    submitRecoveryCodeMutation,
  } = useAuthQuery();

  useEffect(() => {
    if (submitRecoveryCodeMutation.isPending) return;

    const timer = setTimeout(() => {
      otpInputRef.current?.focus();
    }, OTP_INPUT_FOCUS_DELAY_MS);

    return () => clearTimeout(timer);
  }, [submitRecoveryCodeMutation.isPending]);

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

  const handleOTPComplete = async (code: string) => {
    if (!email) {
      toast.error(VERIFY_PASSWORD_RESET_TEXTS.errors.missingEmail);
      return;
    }

    try {
      const response = await submitRecoveryCodeMutation.mutateAsync({
        code,
        email,
      });

      if (response?.token) {
        // Recovery token kept in memory only (SEC-01). It survives the
        // client-side navigation to the new-password screen; a hard reload
        // drops it and the user re-requests a code.
        setRecoveryToken(response.token);
        setAccessToken(null);
        toast.success(VERIFY_PASSWORD_RESET_TEXTS.toasts.success);
        router.push(
          `${ROUTES.provider.newPassword}?email=${encodeURIComponent(email)}`,
        );
      } else {
        toast.error(VERIFY_PASSWORD_RESET_TEXTS.errors.invalidCode);
      }
    } catch (error: unknown) {
      const errorMsg =
        getCleanErrorMessage(error) ||
        VERIFY_PASSWORD_RESET_TEXTS.errors.verifyFailed;
      toast.error(errorMsg);
    }
  };

  const handlePasswordResetResendCode = async () => {
    try {
      await resendPasswordResetVerificationMutation.mutateAsync({ email });
      setSeconds(60);
      setIsRunning(true);
    } catch (error: unknown) {
      const errorMsg =
        getCleanErrorMessage(error) ||
        VERIFY_PASSWORD_RESET_TEXTS.errors.resendFailed;
      toast.error(errorMsg);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return {
    isRunning,
    seconds,
    email,
    otpInputRef,
    submitRecoveryCodeMutation,
    resendPasswordResetVerificationMutation,
    handleOTPComplete,
    handlePasswordResetResendCode,
    handleBack,
  };
};
