import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";

export const SIGN_IN_TEXTS = {
  loading: {
    signingIn: "Signing in...",
    loading: "Loading...",
  },
  form: {
    emailLabel: "Email",
    emailPlaceholder: "Your email address",
  },
  success: {
    passwordReset:
      "Password updated successfully. Sign in with your new password.",
  },
  errors: {
    general: "An unexpected error occurred.",
    signInFailed: "Sign in failed",
  },
};

export const CURATOR_AUTH_TEXTS = {
  noAccount: {
    title: "No curator account found",
    message:
      "Curator accounts are created by a JustGo administrator. Check the email address, or ask an administrator to invite you.",
    back: "Use a different email",
  },
};

export const CHECK_EMAIL_TEXTS = {
  header: {
    switchToPatients: "Switch to Patients",
  },
  form: {
    titlePart1: "Enter your email to",
    signIn: "Sign In",
    or: "or",
    signUp: "Sign Up",
    titlePart2: "as a Provider.",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email address",
  },
  welcome: {
    title: "JustGo Health Providers",
    description:
      "There are thousands of students out there hoping for someone like you. Welcome",
  },
};

export const NEW_PASSWORD_TEXTS = {
  form: {
    title: "Create New Password",
    subtitle: "Set a new password for your provider account",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm password",
    repeatPasswordPlaceholder: "Repeat your password",
    savePassword: "Save password",
    back: "Back",
  },
  passwordMatch: {
    match: "Passwords match",
    mismatch: "Passwords don't match",
  },
  toasts: {
    sessionExpired: "Session expired or invalid. Please verify code again.",
    success: "Password changed successfully",
    loading: "Updating password...",
  },
  errors: {
    general: "An unexpected error occurred.",
    passwordResetFailed: "Password reset failed",
  },
  loading: "Loading...",
};

export const VERIFY_PASSWORD_RESET_TEXTS = {
  header: {
    signIn: "Sign In",
  },
  content: {
    title: "Enter account recovery code",
    subtitlePart1: "A 6-digit recovery code was just sent to",
    resendButton: "Resend code",
    verifying: "Verifying code...",
  },
  footer: {
    back: "Back",
    next: "Next",
  },
  loading: "Loading...",
  toasts: {
    success: "Code verified successfully",
  },
  errors: {
    missingEmail: "Email is missing",
    verifyFailed: "Verification failed",
    invalidCode: "Invalid code or missing token",
    resendFailed: "Failed to resend code",
  },
};

export const PROVIDER_PROFILE_SUB_STEPS = [
  { label: SIGN_UP_TEXTS.profile.steps.photo, index: 0 },
  { label: SIGN_UP_TEXTS.profile.steps.bio, index: 1 },
  { label: SIGN_UP_TEXTS.profile.steps.specialty, index: 2 },
] as const;
