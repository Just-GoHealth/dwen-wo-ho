/**
 * In-memory token store (SEC-01).
 *
 * The access token and the password-recovery token live only in module
 * memory — never localStorage/sessionStorage — so an XSS bug can't read them
 * back out of storage. The refresh token never reaches JS at all: the
 * same-origin route handlers under src/app/api/v1/auth/** keep it in an
 * HttpOnly `__Host-` cookie. After a hard reload the access token is gone and
 * is re-issued from that cookie via `refreshToken()` in lib/auth/session.
 */

let accessToken: string | null = null;
let recoveryToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null | undefined): void => {
  accessToken = token || null;
};

export const getRecoveryToken = (): string | null => recoveryToken;

export const setRecoveryToken = (token: string | null | undefined): void => {
  recoveryToken = token || null;
};

export const clearTokens = (): void => {
  accessToken = null;
  recoveryToken = null;
};

// Keys the app used to keep raw tokens under before SEC-01. Purged on load so
// tokens left behind by an older build don't sit in storage indefinitely.
export const LEGACY_TOKEN_STORAGE_KEYS = [
  "token",
  "curatorToken",
  "refreshToken",
  "recoveryToken",
  "authToken",
  "patientToken",
] as const;

export const purgeLegacyTokenStorage = (): void => {
  if (typeof window === "undefined") return;
  try {
    LEGACY_TOKEN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage can be unavailable (private mode / blocked) — nothing to purge.
  }
};

purgeLegacyTokenStorage();
