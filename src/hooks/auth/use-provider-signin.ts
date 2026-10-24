"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/use-selected-values";
import {
  ProviderLoginSchema,
  ProviderLoginFormData,
} from "@/lib/schemas/provider-auth-schema";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { useApiError } from "@/hooks/shared/use-api-error";
import { routeForMe } from "@/lib/utils/auth/provider-next-route";
import { useAccountRecovery } from "@/hooks/auth/use-account-recovery";
import type { Role } from "@/lib/v2/types";

/** `POST /auth/sign-in {contact, role, password}` → route by `me.next`. */
export const useProviderSignIn = ({
  email,
  role,
  onForgotPassword,
}: {
  email: string;
  role: Role;
  onForgotPassword?: () => void;
}) => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { signInMutation } = useAuthQuery();
  const apiError = useApiError();
  const { handleRecoverAccount, isRecovering, recoveryError } =
    useAccountRecovery(email, role, onForgotPassword);

  const { register, handleSubmit, errors, setError } =
    useSelectedValuesFromReactHookForm(ProviderLoginSchema, {
      mode: "onChange",
      defaultValues: { email, password: "" },
    });

  const onSubmit = async (values: ProviderLoginFormData) => {
    apiError.clear();
    try {
      const me = await signInMutation.mutateAsync({
        contact: values.email,
        role,
        password: values.password,
      });
      setIsRedirecting(true);
      router.replace(routeForMe(me) as Route);
    } catch (error) {
      const described = apiError.capture(error);
      // Wrong password, unknown email and wrong role all look the same.
      if (described.code === "INCORRECT_PASSWORD") {
        setError("password", { message: described.message });
      } else if (described.fieldError("password")) {
        setError("password", { message: described.fieldError("password") });
      }
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit: handleSubmit(onSubmit),
    isLoading: signInMutation.isPending || isRedirecting,
    isRecovering,
    handleRecoverAccount,
    apiError:
      apiError.error?.code === "INCORRECT_PASSWORD"
        ? recoveryError
        : (apiError.error ?? recoveryError),
    secondsLeft: apiError.secondsLeft,
  };
};
