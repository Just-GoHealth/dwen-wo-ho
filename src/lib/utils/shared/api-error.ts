import { ApiError, SYSTEM_ERROR_MESSAGE } from "@/lib/v2/http";

/**
 * TODO(v2-curator): unwraps the legacy v1 envelope error. Curator screens
 * still call this; provider code uses `describeApiError` below.
 */
export function parseApiError(error: unknown): {
  code: string | null;
  message: string;
} {
  if (error instanceof ApiError) {
    return { code: error.code, message: error.message };
  }
  const fallback =
    error instanceof Error ? error.message : "Something went wrong";
  if (!(error instanceof Error)) return { code: null, message: fallback };

  try {
    const parsed = JSON.parse(error.message) as {
      data?: { errorCode?: string; message?: string };
      message?: string;
    };
    return {
      code: parsed.data?.errorCode ?? null,
      message: parsed.data?.message ?? parsed.message ?? fallback,
    };
  } catch {
    return { code: null, message: fallback };
  }
}

export type DescribedApiError = {
  /** RFC 9457 `code`, or "NETWORK" when the request never got an answer. */
  code: string;
  /** `detail` as written by the backend, or fixed copy for SYSTEM/network. */
  message: string;
  /** Only for unexpected errors (show it in small print for support). */
  traceId?: string;
  /** Seconds to wait on RATE_LIMITED. */
  retryAfter?: number;
  fieldError: (field: string) => string | undefined;
};

// Codes a screen is expected to handle in its own words; anything else is
// "unexpected" and shows its trace id.
const EXPECTED_CODES = new Set([
  "VALIDATION",
  "NOT_FOUND",
  "STALE",
  "RATE_LIMITED",
  "CONTACT_IN_USE",
  "INCORRECT_PASSWORD",
  "CODE_INCORRECT",
  "CODE_EXPIRED",
  "CODE_LOCKED",
  "GRANT_EXPIRED",
  "ALREADY_CLAIMED",
  "NOT_APPROVED",
  "NOT_REJECTED",
  "ALREADY_REQUESTED",
  "ALREADY_JOINED",
  "TARGET_UNAVAILABLE",
  "PROFILE_INCOMPLETE",
  "NOT_A_STANDING_911",
  "IMAGE_UNSUPPORTED",
  "IMAGE_TOO_LARGE",
  "IMAGE_UNREADABLE",
  "CONTENT_TOO_LARGE",
]);

export const NETWORK_ERROR_MESSAGE =
  "We couldn't reach JustGo Health. Check your connection and try again.";

/** Turns anything thrown by `@/lib/v2/*` into what a screen shows. */
export function describeApiError(error: unknown): DescribedApiError {
  if (error instanceof ApiError) {
    const unexpected = !EXPECTED_CODES.has(error.code);
    return {
      code: error.code,
      message: error.code === "SYSTEM" ? SYSTEM_ERROR_MESSAGE : error.message,
      traceId: unexpected ? error.traceId : undefined,
      retryAfter: error.code === "RATE_LIMITED" ? error.retryAfter : undefined,
      fieldError: (field) => error.fieldError(field),
    };
  }
  return {
    code: "NETWORK",
    message: NETWORK_ERROR_MESSAGE,
    fieldError: () => undefined,
  };
}

export const isApiErrorCode = (error: unknown, code: string): boolean =>
  error instanceof ApiError && error.code === code;
