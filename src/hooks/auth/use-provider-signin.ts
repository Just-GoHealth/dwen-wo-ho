"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/use-selected-values";
import {
  ProviderLoginSchema,
  ProviderLoginFormData,
} from "@/lib/schemas/provider-auth-schema";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { setUserType } from "@/lib/utils/auth/get-user-type";
import { applyProviderAuthTokens } from "@/lib/utils/auth/provider-tokens";
import { ROUTES } from "@/lib/constants/infra/routes";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { getCleanErrorMessage } from "@/lib/utils/auth/error";
import { getProviderPostLoginTarget } from "@/lib/utils/auth/provider-post-login-redirect";
import {
  buildProviderSignupResumeUrl,
  clearProviderAuthStorage,
  hasProviderAuthToken,
  isProfileIncompleteError,
  parseProfileIncompleteStepFromMessage,
} from "@/lib/utils/provider/signup-resume";
import { useAccountRecovery } from "@/hooks/auth/use-account-recovery";
import type { Route } from "next";

export const useProviderSignIn = ({
  email,
  onForgotPassword,
}: {
  email: string;
  onBack: () => void;
  onForgotPassword?: () => void;
  onProfileIncomplete?: (step: number) => void;
}) => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { loginMutation } = useAuthQuery();
  const { handleRecoverAccount, isRecovering } = useAccountRecovery(
    email,
    onForgotPassword,
  );

  const { register, handleSubmit, errors } = useSelectedValuesFromReactHookForm(
    ProviderLoginSchema,
    {
      mode: "onChange",
      defaultValues: {
        email,
        password: "",
      },
    },
  );

  const onSubmit = async (values: ProviderLoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      const { token, userData } = response || {};

      // The refresh token is already in an HttpOnly cookie (set by the
      // sign-in route handler); only the access token reaches the client.
      if (token) {
        applyProviderAuthTokens({ token, userRole: userData?.userRole });
      }

      if (userData) {
        setIsRedirecting(true);
        router.replace(
          getProviderPostLoginTarget(userData, values.email, response) as Route,
        );
        return;
      }

      localStorage.removeItem("pendingUser:v1");
      setIsRedirecting(true);
      router.replace(ROUTES.provider.home as Route);
    } catch (error: unknown) {
      const errMessage = getCleanErrorMessage(error);

      if (errMessage.includes("ACCOUNT PENDING")) {
        router.replace(ROUTES.provider.home as Route);
        return;
      }

      if (isProfileIncompleteError(errMessage)) {
        const step = parseProfileIncompleteStepFromMessage(errMessage);

        if (hasProviderAuthToken()) {
          setUserType("provider");
          toast.info(SIGN_UP_TEXTS.resume.continueProfile);
          setIsRedirecting(true);
          router.replace(
            buildProviderSignupResumeUrl(values.email, step) as Route,
          );
          return;
        }

        toast.error(SIGN_UP_TEXTS.resume.sessionExpired);
        return;
      }

      clearProviderAuthStorage();
      setUserType(null);
      toast.error(errMessage);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit: handleSubmit(onSubmit),
    isLoading: loginMutation.isPending || isRedirecting,
    isRecovering,
    handleRecoverAccount,
  };
};
