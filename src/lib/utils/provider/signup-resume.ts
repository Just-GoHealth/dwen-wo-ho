import { ROUTES } from "@/lib/constants/infra/routes";
import { clearTokens, getAccessToken } from "@/lib/auth/access-token";
import { clearServerSession } from "@/lib/auth/session";
import { getStoredUserType } from "@/lib/utils/auth/get-user-type";
import type { ProviderOnboardingNextStep } from "@/lib/types/api/auth";
import type { RedirectInfo } from "@/lib/types/auth/redirect";
import type {
  ProviderProfileResumeInput,
  ProviderSignupProfileStepIndex,
  ProviderSignupProfileStepSlug,
} from "@/lib/types/components/provider/signup-resume";

const PROFILE_STEP_SLUGS: ProviderSignupProfileStepSlug[] = [
  "photo",
  "bio",
  "specialty",
];

function getProviderProfilePhotoUrl(
  userData: ProviderProfileResumeInput,
): string | undefined {
  return userData.profileURL || userData.profilePhotoURL || undefined;
}

export function getProviderProfileResumeStep(
  userData: ProviderProfileResumeInput,
): ProviderSignupProfileStepSlug | null {
  if (!getProviderProfilePhotoUrl(userData)) {
    return "photo";
  }
  if (!userData.officePhoneNumber) {
    return "bio";
  }
  if (!userData.specialty?.trim()) {
    return "specialty";
  }
  return null;
}

export function mapBackendNextStepToSlug(
  nextStep: ProviderOnboardingNextStep | string,
): ProviderSignupProfileStepSlug | null {
  switch (nextStep) {
    case "photo":
      return "photo";
    case "phone":
      return "bio";
    case "specialty":
      return "specialty";
    case null:
      return null;
    default:
      return null;
  }
}

export function resolveProviderProfileResumeStep(
  userData: ProviderProfileResumeInput,
): ProviderSignupProfileStepSlug | null {
  if (userData.nextStep === null) {
    return null;
  }

  if (userData.nextStep !== undefined) {
    const mappedStep = mapBackendNextStepToSlug(userData.nextStep);
    if (mappedStep) {
      return mappedStep;
    }
  }

  return getProviderProfileResumeStep(userData);
}

export function buildProviderAuthRedirectTarget(
  redirectInfo: RedirectInfo,
  email: string,
): string {
  if (redirectInfo.step) {
    return `${redirectInfo.path}?email=${encodeURIComponent(email)}&step=${redirectInfo.step}`;
  }

  return redirectInfo.path;
}

export function profileStepSlugToIndex(
  slug: ProviderSignupProfileStepSlug,
): ProviderSignupProfileStepIndex {
  const index = PROFILE_STEP_SLUGS.indexOf(slug);
  return (index >= 0 ? index : 0) as ProviderSignupProfileStepIndex;
}

export function isProviderSignupProfileStepSlug(
  value: string | null | undefined,
): value is ProviderSignupProfileStepSlug {
  return value === "photo" || value === "bio" || value === "specialty";
}

export function buildProviderSignupResumeUrl(
  email: string,
  slug: ProviderSignupProfileStepSlug,
): string {
  return `${ROUTES.provider.signUp}?email=${encodeURIComponent(email)}&step=${slug}`;
}

export function hasProviderAuthToken(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(getAccessToken() || getStoredUserType());
}

export function isProfileIncompleteError(message: string): boolean {
  return message.includes("Profile is not complete");
}

export function parseProfileIncompleteStepFromMessage(
  message: string,
): ProviderSignupProfileStepSlug {
  if (message.includes("upload your profile photo")) {
    return "photo";
  }
  if (message.includes("office phone number")) {
    return "bio";
  }
  if (message.includes("add your specialty")) {
    return "specialty";
  }
  return "photo";
}

export function clearProviderAuthStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  clearTokens();
  void clearServerSession();
  localStorage.removeItem("pendingUser:v1");
}
