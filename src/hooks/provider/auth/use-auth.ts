"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  getUserType,
  hasValidToken,
  setUserType,
} from "@/lib/utils/auth/get-user-type";
import { ROUTES } from "@/lib/constants/infra/routes";
import { refreshToken } from "@/lib/auth/session";
import { clearTokens } from "@/lib/auth/access-token";
import { authService } from "@/services/shared/auth";
import { getProviderRedirectInfo } from "@/lib/utils/auth/redirect";
import {
  buildProviderSignupResumeUrl,
  isProviderSignupProfileStepSlug,
} from "@/lib/utils/provider/signup-resume";
import type { AuthStep } from "@/lib/types/components/auth/base-sign-in";

export function useProviderAuth() {
  const searchParams = useSearchParams();
  const initialStep = (searchParams.get("step") as AuthStep) || "check-email";
  const initialEmail = searchParams.get("email");
  const passwordResetSuccess = searchParams.get("reset") === "success";

  const [step, setStep] = useState<AuthStep>("check-email");
  const [email, setEmail] = useState<string>(initialEmail || "");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const hasCheckedRef = useRef(false);
  const hasRedirectedRef = useRef(false);
  const isCheckingRef = useRef(false);

  const [profileStep, setProfileStep] = useState<number | null>(null);

  useEffect(() => {
    if (hasCheckedRef.current || isCheckingRef.current) return;
    hasCheckedRef.current = true;
    isCheckingRef.current = true;

    const checkAuthAndRedirect = async () => {
      if (hasRedirectedRef.current) {
        return;
      }

      const clearAuthAndProceed = () => {
        if (typeof window !== "undefined") {
          clearTokens();
          localStorage.removeItem("pendingUser:v1");
        }
        setUserType(null);
        if (!hasRedirectedRef.current) {
          // Apply URL-derived step/email in the same render as the auth check
          // completing — a single state transition that avoids a flash of the
          // wrong step (previously a chained second useEffect handled this).
          if (initialEmail) {
            setEmail(decodeURIComponent(initialEmail));
          }

          const resolvedStep =
            initialStep === "sign-in" && !initialEmail
              ? "check-email"
              : initialStep;
          setStep(resolvedStep);

          isCheckingRef.current = false;
          setIsCheckingAuth(false);
        }
      };

      const verifyProfileAndRedirect = async () => {
        try {
          const profileData = await authService.getProfile();

          if (profileData && !hasRedirectedRef.current) {
            if (getUserType() === "curator") {
              hasRedirectedRef.current = true;
              isCheckingRef.current = false;
              window.location.href = ROUTES.curator.schools;
              return true;
            }

            const redirectInfo = getProviderRedirectInfo(profileData);

            if (redirectInfo.isPending) {
              localStorage.setItem(
                "pendingUser:v1",
                JSON.stringify(profileData),
              );
            } else {
              localStorage.removeItem("pendingUser:v1");
            }

            hasRedirectedRef.current = true;
            isCheckingRef.current = false;

            const profileEmail = profileData.email || "";
            if (
              redirectInfo.step &&
              profileEmail &&
              isProviderSignupProfileStepSlug(redirectInfo.step)
            ) {
              window.location.href = buildProviderSignupResumeUrl(
                profileEmail,
                redirectInfo.step,
              );
            } else {
              window.location.href = redirectInfo.path;
            }

            return true;
          }

          clearAuthAndProceed();
          return false;
        } catch {
          clearAuthAndProceed();
          return false;
        }
      };

      // A session hint means the HttpOnly refresh cookie may still be valid:
      // try to re-issue the access token from it before showing sign-in.
      if (hasValidToken()) {
        const refreshedToken = await refreshToken();
        if (refreshedToken && !hasRedirectedRef.current) {
          await verifyProfileAndRedirect();
          return;
        }
        clearAuthAndProceed();
        return;
      }

      if (!hasRedirectedRef.current) {
        // Reached when there's no token and no valid refresh — apply URL params
        // immediately since no redirect will happen.
        if (initialEmail) {
          setEmail(decodeURIComponent(initialEmail));
        }
        const resolvedStep =
          initialStep === "sign-in" && !initialEmail
            ? "check-email"
            : initialStep;
        setStep(resolvedStep);
        isCheckingRef.current = false;
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndRedirect();

    return () => {
      isCheckingRef.current = false;
      hasCheckedRef.current = false;
    };
  }, [initialEmail, initialStep]);

  const handleEmailSubmit = useCallback(
    (submittedEmail: string, emailExists: boolean) => {
      setEmail(submittedEmail);
      if (emailExists) {
        setStep("sign-in");
      } else {
        setStep("sign-up");
      }
    },
    [],
  );

  const handleBackToEmail = useCallback(() => {
    setStep("check-email");
  }, []);

  const handleForgotPassword = useCallback(() => {
    setStep("reset-password");
  }, []);

  const handleProfileIncomplete = useCallback((incompleteStep: number) => {
    setStep("sign-up");
    setProfileStep(incompleteStep);
  }, []);

  const handleBackToSignIn = useCallback(() => {
    setStep("sign-in");
  }, []);

  const handleBackToCheckEmail = useCallback(() => {
    setStep("check-email");
  }, []);

  return {
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
  };
}
