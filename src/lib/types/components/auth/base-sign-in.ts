import { FieldErrors, UseFormRegister } from "react-hook-form";
import type { DescribedApiError } from "@/lib/utils/shared/api-error";

/** `claim` is for an account a curator created: claim → code → password. */
export type AuthStep =
  "check-email" | "sign-in" | "sign-up" | "reset-password" | "claim";

export type AuthAudience = "provider" | "curator";

export interface BaseSignInFormProps {
  audience: AuthAudience;
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onBack: () => void;
  onForgotPassword?: () => void;
  onRecoverAccount?: () => void;
  isLoading: boolean;
  isRecovering?: boolean;
  successMessage?: string;
  apiError?: DescribedApiError | null;
  /** RATE_LIMITED countdown; the submit button stays disabled while > 0. */
  secondsLeft?: number;
}
