import { ApiError } from "@/lib/v2/http";
import type { ProviderPatchRequest, ProviderProfile } from "@/lib/v2/types";

export type ProfilePatchOutcome =
  | { kind: "saved"; profile: ProviderProfile }
  /** Someone changed the profile since it was read: here is the fresh copy. */
  | { kind: "stale"; profile: ProviderProfile; message: string };

/**
 * `PATCH /providers/me` with the `version` of the profile the user edited.
 * On `409 STALE` the profile is reloaded (never retried blindly), so the
 * screen can show the fresh values and tell the user to re-apply the edit.
 */
export async function patchProviderProfile(
  current: Pick<ProviderProfile, "version">,
  changes: Omit<ProviderPatchRequest, "version">,
  deps: {
    patch: (body: ProviderPatchRequest) => Promise<ProviderProfile>;
    reload: () => Promise<ProviderProfile>;
  },
): Promise<ProfilePatchOutcome> {
  try {
    const profile = await deps.patch({ ...changes, version: current.version });
    return { kind: "saved", profile };
  } catch (error) {
    if (error instanceof ApiError && error.code === "STALE") {
      const profile = await deps.reload();
      return { kind: "stale", profile, message: error.message };
    }
    throw error;
  }
}

/** The setup steps a `missing[]` field belongs to (photo, bio, specialty). */
export const PROFILE_STEP_FIELDS = [
  ["photo"],
  ["phone"],
  ["roleCategoryIds"],
] as const;

/**
 * First setup step that still has a missing field, or the last step when
 * only title/fullName are missing (both are set at sign-up and edited on
 * the profile later). Returns null when nothing is missing.
 */
export function firstMissingStep(missing: readonly string[]): 0 | 1 | 2 | null {
  if (missing.length === 0) return null;
  const index = PROFILE_STEP_FIELDS.findIndex((fields) =>
    fields.some((f) => missing.includes(f)),
  );
  return (index === -1 ? 2 : index) as 0 | 1 | 2;
}

/**
 * Normalises a phone for `PATCH /providers/me`: a local 10-digit `0…`
 * number becomes `+233…`; anything with a country code is sent as typed.
 */
export function toE164Phone(raw: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) return `+${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.length === 10 && digits.startsWith("0"))
    return `+233${digits.slice(1)}`;
  if (digits.length === 9) return `+233${digits}`;
  return digits ? `+${digits}` : "";
}
