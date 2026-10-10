"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/infra/routes";
import { getRecoveryToken, setRecoveryToken } from "@/lib/auth/access-token";
import useGetSearchParams from "@/hooks/shared/use-get-search-params";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { ProviderPasswordSchema } from "@/lib/schemas/provider-auth-schema";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/provider/auth/auth-copy";
import { getCleanErrorMessage } from "@/lib/utils/auth/error";
import { finalizeProviderSignInSession } from "@/lib/utils/auth/provider-sign-in-session";
import type { Route } from "next";

export const useNewPassword = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const email = useGetSearchParams("email");
  const router = useRouter();
  const { resetPasswordMutation } = useAuthQuery();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<z.output<typeof ProviderPasswordSchema>>({
    resolver: zodResolver(ProviderPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Client-side guard kept intentionally: the redirect depends on values that
  // only exist in the browser (URL search param + in-memory recovery token),
  // so it cannot be relocated to middleware or a server redirect.
  useEffect(() => {
    if (!email) {
      router.push(ROUTES.provider.auth);
      return;
    }

    const storedToken = getRecoveryToken();
    if (!storedToken) {
      toast.error(NEW_PASSWORD_TEXTS.toasts.sessionExpired);
      router.push(
        `${ROUTES.provider.resetPassword}&email=${encodeURIComponent(email)}`,
      );
    }
  }, [email, router]);

  const handleBack = () => {
    if (!email) {
      router.back();
      return;
    }
    router.push(
      `${ROUTES.provider.resetPassword}&email=${encodeURIComponent(email)}`,
    );
  };

  const onSubmit = async (values: z.output<typeof ProviderPasswordSchema>) => {
    try {
      const storedToken = getRecoveryToken();

      const response = await resetPasswordMutation.mutateAsync({
        password: values.password,
        confirmPassword: values.confirmPassword,
        token: storedToken || undefined,
      });

      setRecoveryToken(null);

      const { token, userData } = response;

      if (token && userData) {
        toast.success(NEW_PASSWORD_TEXTS.toasts.success);
        setIsRedirecting(true);
        router.replace(
          finalizeProviderSignInSession(response, email ?? "") as Route,
        );
        return;
      }

      toast.success(NEW_PASSWORD_TEXTS.toasts.success);
      router.push(
        `${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(email ?? "")}&reset=success` as Route,
      );
    } catch (error: unknown) {
      toast.error(
        getCleanErrorMessage(error) || NEW_PASSWORD_TEXTS.errors.general,
      );
    }
  };

  return {
    email,
    showPassword,
    setShowPassword,
    password,
    confirmPassword,
    isFormValid: isValid,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleBack,
    isSubmitting: resetPasswordMutation.isPending || isRedirecting,
  };
};
