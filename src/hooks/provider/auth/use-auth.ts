"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { authApi } from "@/lib/v2/auth";
import { hasValidToken } from "@/lib/utils/auth/get-user-type";
import { routeForMe } from "@/lib/utils/auth/provider-next-route";
import { rememberSignedIn } from "@/hooks/queries/use-auth";
import type { LookupResponse } from "@/lib/v2/types";
import type { AuthStep } from "@/lib/types/components/auth/base-sign-in";

const STEPS: AuthStep[] = [
  "check-email",
  "sign-in",
  "sign-up",
  "reset-password",
  "claim",
];

/**
 * Drives the email-first auth workspace. `POST /auth/lookup` decides the
 * branch: unknown → sign-up, claimed → password, unclaimed (created by a
 * curator) → claim. A browser that already has a session is sent on by
 * `GET /auth/me` (the source of truth; the stored user type is only a hint).
 */
export function useProviderAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as AuthStep | null;
  const initialEmail = searchParams.get("email");
  const passwordResetSuccess = searchParams.get("reset") === "success";

  const [step, setStep] = useState<AuthStep>("check-email");
  const [email, setEmail] = useState<string>(initialEmail ?? "");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    const showSteps = () => {
      const wanted = stepParam && STEPS.includes(stepParam) ? stepParam : null;
      // A step that needs an email falls back to the email step without one.
      setStep(
        wanted && (wanted === "check-email" || initialEmail)
          ? wanted
          : "check-email",
      );
      setIsCheckingAuth(false);
    };

    if (!hasValidToken()) {
      showSteps();
      return;
    }

    authApi
      .me()
      .then((me) => {
        rememberSignedIn(me);
        router.replace(routeForMe(me) as Route);
      })
      .catch(showSteps);
  }, [initialEmail, router, stepParam]);

  const handleLookup = useCallback(
    (submittedEmail: string, result: LookupResponse) => {
      setEmail(submittedEmail);
      if (!result.exists) setStep("sign-up");
      else if (result.claimed) setStep("sign-in");
      else setStep("claim");
    },
    [],
  );

  const handleBackToEmail = useCallback(() => setStep("check-email"), []);
  const handleForgotPassword = useCallback(() => setStep("reset-password"), []);
  const handleBackToSignIn = useCallback(() => setStep("sign-in"), []);

  return {
    step,
    email,
    passwordResetSuccess,
    isCheckingAuth,
    handleLookup,
    handleBackToEmail,
    handleForgotPassword,
    handleBackToSignIn,
    handleBackToCheckEmail: handleBackToEmail,
  };
}
