export interface CheckEmailProps {
  onEmailSubmit: (email: string, emailExists: boolean) => void;
}

export interface ProviderSignInProps {
  audience?: "provider" | "curator";
  successMessage?: string;
  email: string;
  onBack: () => void;
  onForgotPassword?: () => void;
  onProfileIncomplete?: (step: number) => void;
}

export interface VerifyPasswordResetProps {
  email: string;
  onBack?: () => void;
}

export interface ProviderSignUpProps {
  email?: string;
  fullName?: string;
  title?: string;
  specialty?: string;
  profileImage?: string;
  onBack?: () => void;
  profileStep: number | null;
  isResumeLocked?: boolean;
  isCheckingGuard?: boolean;
}

export interface CreateAccountProps {
  email?: string;
  fullName?: string;
  title?: string;
  agreedToTerms: boolean;
  onAgreedToTermsChange: (agreed: boolean) => void;
  onNext: (data: {
    email: string;
    fullName: string;
    title: string;
    password?: string;
  }) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export interface SignUpVerificationProps {
  email: string;
  onNext: () => void;
}

export interface SignUpProfileProps {
  email: string;
  fullName: string;
  title: string;
  specialty?: string;
  profileImage?: string;
  onBack?: () => void;
  startStep?: number;
  password?: string;
  isResumeLocked?: boolean;
}

export interface SignUpProfileContentProps {
  currentStep: number;
  profileData: ProviderProfileData;
  onFieldChange: (
    property: keyof ProviderProfileData,
    value: string | null,
  ) => void;
}

export interface ProviderProfileData {
  photo: string | null;
  phoneNumber: string;
  bio: string;
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
}

export interface PhotoStepProps {
  profilePhoto: string | null;
  onChange: (field: "photo", value: string | null) => void;
}
