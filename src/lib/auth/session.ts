import { configureHttp, signOut } from "@/lib/v2/http";
import { setUserType } from "@/lib/utils/auth/get-user-type";
import { getSignInRoute } from "@/lib/utils/auth/sign-in-route";
import type { QueryClient } from "@tanstack/react-query";

/**
 * Client session glue for backend v2. The backend owns the session as
 * HttpOnly cookies (access, refresh with Path=/auth, XSRF-TOKEN); this app
 * never sees a token. `GET /auth/me` is the source of truth; the stored
 * `userType` is only a UI hint for which sign-in screen to return to.
 */

let isHandlingExpiry = false;

const clearLocalAuthState = () => {
  setUserType(null);
  try {
    localStorage.removeItem("pendingUser:v1");
    sessionStorage.clear();
  } catch {
    // Storage unavailable — nothing to clear.
  }
};

/**
 * The refresh failed (a second 401): the session is over, so clear local
 * state and send the user to sign in. Wired into http.ts by
 * `installSessionHandlers()`.
 */
export const handleSessionExpired = () => {
  if (isHandlingExpiry || typeof window === "undefined") return;
  isHandlingExpiry = true;

  // Read before clearing: it decides which sign-in screen to return to.
  const signInRoute = getSignInRoute();
  clearLocalAuthState();

  const path = window.location.pathname;
  const isAuthPage =
    path.includes("/auth") ||
    path.includes("/signup") ||
    path.includes("/new-password") ||
    path.includes("/join");
  if (!isAuthPage) window.location.replace(signInRoute);

  setTimeout(() => {
    isHandlingExpiry = false;
  }, 1000);
};

let installed = false;

/** Call once on the client (app providers). */
export const installSessionHandlers = () => {
  if (installed) return;
  installed = true;
  configureHttp({ onSessionExpired: handleSessionExpired });
};

/**
 * Ends the session on the server (`POST /auth/sign-out` clears the cookies),
 * clears local state and the query cache, then redirects to sign-in.
 */
export const performLogout = async (
  queryClient?: QueryClient,
  redirectTo?: string,
) => {
  if (typeof window === "undefined") return;

  const signInRoute = getSignInRoute();
  await signOut();
  clearLocalAuthState();

  if (queryClient) {
    try {
      queryClient.clear();
    } catch {
      // Cache already gone.
    }
  }

  window.location.replace(redirectTo || signInRoute);
};
