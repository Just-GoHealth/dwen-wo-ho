import { setAccessToken } from "@/lib/auth/access-token";
import { setUserType } from "@/lib/utils/auth/get-user-type";

/**
 * Stores a freshly issued session. The access token is kept in memory only;
 * the refresh token never reaches the client — the auth route handler has
 * already moved it into an HttpOnly cookie (SEC-01).
 */
export function applyProviderAuthTokens({
  token,
  userRole,
}: {
  token?: string | null;
  refreshToken?: string | null;
  userRole?: string | null;
}): void {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    setAccessToken(token);
  }

  setUserType(userRole === "ROLE_CURATOR" ? "curator" : "provider");
}
