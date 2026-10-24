/**
 * RFC 9457 handling shared by the curator screens. Branch on `ApiError.code`; show
 * `detail` (the error's message) and `fieldError(field)` beside each field.
 */
import { toast } from "sonner";
import { ApiError, SYSTEM_ERROR_MESSAGE } from "@/lib/v2/http";

/** Messages for the curator-only codes, used when the server's `detail` is missing. */
const CURATOR_MESSAGES: Record<string, string> = {
  STALE:
    "Someone else changed this while you were editing. We've loaded the latest version.",
  NAME_TAKEN: "That name is already taken.",
  TEAM_HAS_MEMBERS: "Students have already joined this team.",
  CAPACITY_REACHED: "That would issue more codes than the team has seats.",
  CODES_EXCEED_CAPACITY:
    "The team already has more codes than that. Revoke some first.",
  REQUEST_DECIDED: "This request has already been decided.",
  EMAIL_LOCKED:
    "This provider has claimed their account, so their email can't be changed here.",
  NO_EMAIL: "Add an email address before sending an invite.",
  RATE_LIMITED: "Too many attempts. Please wait a moment and try again.",
};

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function hasCode(error: unknown, ...codes: string[]): boolean {
  return isApiError(error) && codes.includes(error.code);
}

/** 409 STALE: reload, then tell the user. */
export const isStale = (error: unknown) => hasCode(error, "STALE");

/** The message to show for any error from a curator call. */
export function curatorErrorMessage(error: unknown, fallback?: string): string {
  if (isApiError(error)) {
    if (error.code === "STALE") return CURATOR_MESSAGES.STALE;
    if (error.code === "RATE_LIMITED" && error.retryAfter) {
      return `Too many attempts. Try again in ${error.retryAfter}s.`;
    }
    // `message` is the server's `detail` (SYSTEM_ERROR_MESSAGE for 5xx).
    if (error.message) return error.message;
    return CURATOR_MESSAGES[error.code] ?? fallback ?? SYSTEM_ERROR_MESSAGE;
  }
  return fallback ?? SYSTEM_ERROR_MESSAGE;
}

/** `fieldError()` for a form field, or undefined when the error isn't an ApiError. */
export function fieldMessage(
  error: unknown,
  field: string,
): string | undefined {
  return isApiError(error) ? error.fieldError(field) : undefined;
}

/**
 * Standard toast for a failed curator mutation. On 409 STALE, `onStale` runs first
 * (invalidate/refetch the record) and the user is told the latest version was loaded.
 */
export function toastCuratorError(
  error: unknown,
  options: { fallback?: string; onStale?: () => void } = {},
): void {
  if (isStale(error)) options.onStale?.();
  toast.error(curatorErrorMessage(error, options.fallback));
}
