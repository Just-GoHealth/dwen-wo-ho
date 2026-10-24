"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/use-selected-values";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import {
  ProviderSignUpSchema,
  ProviderSignUpFormData,
} from "@/lib/schemas/provider-auth-schema";
import { CreateAccountProps } from "@/lib/types/components/provider/auth";
import {
  SIGN_UP_TEXTS,
  TITLE_SELECT_OPEN_DELAY_MS,
} from "@/lib/constants/components/provider/auth/signup";
import { ROUTES } from "@/lib/constants/infra/routes";
import { toTitleCase } from "@/lib/utils/shared/string-case";
import { toast } from "sonner";
import { useApiError } from "@/hooks/shared/use-api-error";

export const useCreateAccount = ({
  email: propEmail,
  fullName: propFullName,
  title: propTitle,
  agreedToTerms,
  onNext,
  onValidityChange,
}: CreateAccountProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isTitleSelectOpen, setIsTitleSelectOpen] = useState<boolean>(false);

  const { providerSignUpMutation: signupMutation } = useAuthQuery();
  const apiError = useApiError();

  const {
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    setError,
    formState: { isValid },
  } = useSelectedValuesFromReactHookForm<ProviderSignUpFormData>(
    ProviderSignUpSchema,
    {
      mode: "onChange",
      defaultValues: {
        email: propEmail || "",
        title: propTitle || "",
        fullName: propFullName ? toTitleCase(propFullName) : "",
        password: "",
      },
    },
  );

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTitleSelectOpen(true);
    }, TITLE_SELECT_OPEN_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (values: ProviderSignUpFormData) => {
    if (!agreedToTerms) {
      toast.error(SIGN_UP_TEXTS.errors.termsRequired);
      return;
    }

    apiError.clear();
    const formattedFullName = toTitleCase(values.fullName);
    try {
      // 202: a DRAFT provider exists and the SIGN_UP code is on its way.
      await signupMutation.mutateAsync({
        email: values.email,
        password: values.password,
        title: values.title,
        fullName: formattedFullName,
      });

      onNext({
        email: values.email,
        fullName: formattedFullName,
        title: values.title,
      });
    } catch (error: unknown) {
      const described = apiError.capture(error);

      if (described.code === "CONTACT_IN_USE") {
        toast.error(described.message);
        router.push(
          `${ROUTES.provider.signIn}&email=${encodeURIComponent(values.email)}` as Route,
        );
        return;
      }

      let shownBesideField = false;
      for (const field of ["title", "fullName", "password"] as const) {
        const message = described.fieldError(field);
        if (message) {
          setError(field, { message });
          shownBesideField = true;
        }
      }
      if (!shownBesideField) toast.error(described.message);
    }
  };

  const handleTitleChange = (value: string) => {
    setValue("title", value, { shouldValidate: true });
  };

  const fullNameRegister = register("fullName");

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = toTitleCase(e.target.value);
    e.target.value = formatted;
    fullNameRegister.onChange(e);
  };

  const handleFullNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formatted = toTitleCase(e.target.value);
    e.target.value = formatted;
    setValue("fullName", formatted, { shouldValidate: true });
    fullNameRegister.onBlur(e);
  };

  const email = watch("email");
  const title = watch("title");
  const fullName = watch("fullName");
  const password = watch("password");

  return {
    showPassword,
    setShowPassword,
    signupMutation,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleTitleChange,
    fullNameRegister,
    handleFullNameChange,
    handleFullNameBlur,
    isTitleSelectOpen,
    setIsTitleSelectOpen,
    email,
    title,
    fullName,
    password,
    apiError,
  };
};
