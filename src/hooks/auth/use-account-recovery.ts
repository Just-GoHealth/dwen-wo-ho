"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { useApiError } from "@/hooks/shared/use-api-error";
import { ROUTES } from "@/lib/constants/infra/routes";
import { CODE_SENT_TEXT } from "@/lib/constants/components/provider/auth/auth-copy";
import type { Role } from "@/lib/v2/types";

/** "Forgot your password?" → `POST /auth/recovery` (always 202). */
export const useAccountRecovery = (
  email: string,
  role: Role,
  onForgotPassword?: () => void,
) => {
  const router = useRouter();
  const { recoveryMutation } = useAuthQuery();
  const apiError = useApiError();

  const handleRecoverAccount = async () => {
    apiError.clear();
    try {
      await recoveryMutation.mutateAsync({ contact: email, role });
      toast.success(CODE_SENT_TEXT);
      if (onForgotPassword) {
        onForgotPassword();
      } else {
        router.push(
          `${ROUTES.provider.resetPassword}&email=${encodeURIComponent(email)}`,
        );
      }
    } catch (error) {
      apiError.capture(error);
    }
  };

  return {
    handleRecoverAccount,
    isRecovering: recoveryMutation.isPending || apiError.isRateLimited,
    recoveryError: apiError.error,
  };
};
