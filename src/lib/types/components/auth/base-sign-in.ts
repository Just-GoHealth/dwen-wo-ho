import { FieldErrors, UseFormRegister } from "react-hook-form";

export type AuthStep = "check-email" | "sign-in" | "sign-up" | "reset-password";

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
}
