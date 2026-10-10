import { LANDING_2_SEQUENCE_IDS } from "@/lib/constants/components/marketing/landing-2-sequence";
import { LANDING_2_CONTENT } from "@/lib/marketing/landing-2";
import { PATIENT_APP_URL } from "@/configs/config";

const LOCK_IN_WITH_PREFIX = "Lock In with @";

export function parseReferralFromLockInLabel(
  text: string,
  defaultLabel: string = LANDING_2_CONTENT.intro.lockInDefault,
): string | null {
  if (text === defaultLabel) {
    return null;
  }

  if (text.startsWith(LOCK_IN_WITH_PREFIX)) {
    const handle = text.slice(LOCK_IN_WITH_PREFIX.length).trim();
    return handle || null;
  }

  return null;
}

export function syncLockInButtonReferral(
  lockInBtn: HTMLElement,
  labelText: string,
): void {
  const referral = parseReferralFromLockInLabel(labelText);

  if (referral) {
    lockInBtn.dataset.referral = referral;
    return;
  }

  delete lockInBtn.dataset.referral;
}

export function getLanding2LockInReferral(): string | null {
  const lockInBtn = document.getElementById(LANDING_2_SEQUENCE_IDS.lockInBtn);
  if (!lockInBtn) {
    return null;
  }

  const referral = lockInBtn.dataset.referral?.trim();
  return referral || null;
}

/**
 * Entry URL of the patient app, carrying the influencer handle as `?ref=`
 * (the patient app stores it and sends it with signup). Null when the
 * patient app URL isn't configured for this environment.
 */
export function buildPatientAppUrl(
  referralHandle?: string | null,
  baseUrl: string | null = PATIENT_APP_URL,
): string | null {
  if (!baseUrl) {
    return null;
  }

  const url = new URL(`${baseUrl}/`);
  const trimmed = referralHandle?.trim();
  if (trimmed) {
    url.searchParams.set("ref", trimmed);
  }
  return url.toString();
}
