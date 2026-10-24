import type { LookupResponse, Me, Role } from "@/lib/v2/types";

export interface CheckEmailProps {
  role: Role;
  onLookup: (email: string, result: LookupResponse) => void;
}

export interface ProviderSignInProps {
  audience?: "provider" | "curator";
  successMessage?: string;
  email: string;
  onBack: () => void;
  onForgotPassword?: () => void;
}

/** One OTP screen for both account recovery and claiming an account. */
export interface VerifyPasswordResetProps {
  email: string;
  role: Role;
  purpose: "RECOVERY" | "CLAIM";
  onBack?: () => void;
}

export interface ProviderSignUpProps {
  email?: string;
  fullName?: string;
  title?: string;
  onBack?: () => void;
  /** Open straight on profile setup (signed in, `next: PROFILE_SETUP`). */
  startOnProfile?: boolean;
}

export interface CreateAccountProps {
  email?: string;
  fullName?: string;
  title?: string;
  agreedToTerms: boolean;
  onAgreedToTermsChange: (agreed: boolean) => void;
  onNext: (data: { email: string; fullName: string; title: string }) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export interface SignUpVerificationProps {
  email: string;
  onVerified: (me: Me) => void;
}

export interface SignUpProfileContentProps {
  currentStep: number;
  profileData: ProviderProfileData;
  onFieldChange: (
    property: keyof ProviderProfileData,
    value: string | null,
  ) => void;
  fieldError?: (field: string) => string | undefined;
}

export interface ProviderProfileData {
  /** Preview URL of the uploaded photo (the upload itself already happened). */
  photo: string | null;
  phoneNumber: string;
  /** Slogan ("When it comes to mental health, I believe…"); optional. */
  bio: string;
  /** Role category id (`roleCategoryIds[0]`). */
  specialty: string;
}

export type ProviderProfileStep = 0 | 1 | 2;

export interface SpecialtyStepProps {
  specialty: string;
  onChange: (field: "specialty", value: string) => void;
}

export interface BioStepProps {
  phoneNumber: string;
  bio: string;
  onChange: (field: "phoneNumber" | "bio", value: string) => void;
  fieldError?: (field: string) => string | undefined;
}

export interface PhotoStepProps {
  profilePhoto: string | null;
  onChange: (field: "photo", value: string | null) => void;
}
