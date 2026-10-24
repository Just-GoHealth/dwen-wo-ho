"use client";

import { useAuthQuery } from "@/hooks/queries/use-auth";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/use-selected-values";
import { useApiError } from "@/hooks/shared/use-api-error";
import { ProviderEmailSchema } from "@/lib/schemas/provider-auth-schema";
import type { LookupResponse, Role } from "@/lib/v2/types";

/** Step 1: `POST /auth/lookup {contact: email, role}`. */
export function useProviderCheckEmail({
  role,
  onLookup,
}: {
  role: Role;
  onLookup: (email: string, result: LookupResponse) => void;
}) {
  const { lookupMutation } = useAuthQuery();
  const apiError = useApiError();

  const { register, handleSubmit, errors } = useSelectedValuesFromReactHookForm(
    ProviderEmailSchema,
    { mode: "onChange" },
  );

  const checkEmailExists = async (email: string) => {
    apiError.clear();
    try {
      const result = await lookupMutation.mutateAsync({
        contact: email.trim(),
        role,
      });
      onLookup(email.trim(), result);
    } catch (error) {
      apiError.capture(error);
    }
  };

  return {
    checkEmailExists,
    isLoading: lookupMutation.isPending,
    apiError,
    form: { register, handleSubmit, errors },
  };
}
