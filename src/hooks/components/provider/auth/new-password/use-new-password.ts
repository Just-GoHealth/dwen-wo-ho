"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Route } from "next";
import { ROUTES } from "@/lib/constants/infra/routes";
import useGetSearchParams from "@/hooks/shared/use-get-search-params";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { useApiError } from "@/hooks/shared/use-api-error";
import { ProviderPasswordSchema } from "@/lib/schemas/provider-auth-schema";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/provider/auth/auth-copy";
import { peekGrant, releaseGrant } from "@/lib/auth/grant";
import { routeForMe } from "@/lib/utils/auth/provider-next-route";

const stepUrl = (step: "reset-password" | "claim", email: string) =>
  `${ROUTES.provider.auth}?step=${step}&email=${encodeURIComponent(email)}`;

/**
 * Spends the verified `grant` on `POST /auth/password {grant, password}`:
 * signed in, every other session ended, then routed by `me.next`.
 */
export const useNewPassword = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const email = useGetSearchParams("email");
  const router = useRouter();
  const { setPasswordMutation } = useAuthQuery();
  const apiError = useApiError();
  const [pending] = useState(peekGrant);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm<z.output<typeof ProviderPasswordSchema>>({
    resolver: zodResolver(ProviderPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const backStep = pending?.purpose === "CLAIM" ? "claim" : "reset-password";

  // The grant only lives in memory; without it there's nothing to spend.
  useEffect(() => {
    if (!email) {
      router.push(ROUTES.provider.auth);
      return;
    }
    if (!pending) {
      toast.error(NEW_PASSWORD_TEXTS.toasts.sessionExpired);
      router.push(stepUrl("reset-password", email) as Route);
    }
  }, [email, pending, router]);

  const handleBack = () => {
    if (!email) {
      router.back();
      return;
    }
    router.push(stepUrl(backStep, email) as Route);
  };

  const onSubmit = async (values: z.output<typeof ProviderPasswordSchema>) => {
    if (!pending) return;
    apiError.clear();
    try {
      const me = await setPasswordMutation.mutateAsync({
        grant: pending.grant,
        password: values.password,
      });
      releaseGrant();
      toast.success(NEW_PASSWORD_TEXTS.toasts.success);
      setIsRedirecting(true);
      router.replace(routeForMe(me) as Route);
    } catch (error) {
      const described = apiError.capture(error);
      if (described.code === "GRANT_EXPIRED") {
        releaseGrant();
        toast.error(described.message);
        router.push(stepUrl(backStep, pending.email) as Route);
        return;
      }
      const passwordError = described.fieldError("password");
      if (passwordError) setError("password", { message: passwordError });
    }
  };

  return {
    email,
    showPassword,
    setShowPassword,
    password,
    confirmPassword,
    isFormValid: isValid && !apiError.isRateLimited,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleBack,
    apiError: apiError.error,
    isSubmitting: setPasswordMutation.isPending || isRedirecting,
  };
};
