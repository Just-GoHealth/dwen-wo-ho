import { STATIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";
import { setUserType, getStoredUserType } from "@/lib/utils/auth/get-user-type";
import { getSignInRoute } from "@/lib/utils/auth/sign-in-route";
import {
  clearTokens,
  getAccessToken,
  LEGACY_TOKEN_STORAGE_KEYS,
  setAccessToken,
} from "@/lib/auth/access-token";
import type { QueryClient } from "@tanstack/react-query";

let isHandlingAuthError = false;
let refreshPromise: Promise<string | null> | null = null;
// Set by logout so a refresh already in flight can't quietly reinstate the
// session once it resolves.
let loggedOut = false;

/**
 * Re-issues the access token from the HttpOnly refresh cookie (via the
 * same-origin route handler) and keeps it in memory only. Concurrent callers
 * share one in-flight request.
 */
export const refreshToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  loggedOut = false;

  refreshPromise = (async () => {
    try {
      // Call the refresh route directly (not via api()) to avoid a circular
      // dependency between this module and lib/api.
      const res = await fetch(STATIC_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        method: "POST",
        headers: { Accept: "*/*" },
        credentials: "same-origin",
      });

      if (!res.ok || loggedOut) {
        return null;
      }

      const json = await res.json();
      const data = json?.data ?? json;
      const newAccessToken: string | undefined =
        data?.accessToken || data?.token;

      if (!newAccessToken) {
        return null;
      }

      setAccessToken(newAccessToken);
      if (!getStoredUserType()) {
        setUserType(
          data?.userData?.userRole === "ROLE_CURATOR" ? "curator" : "provider",
        );
      }
      return newAccessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Clears the HttpOnly refresh cookie server-side (and signs out on the
 * backend when we still hold an access token). Awaited before redirecting,
 * otherwise the sign-in page could silently restore the session from a
 * cookie that hasn't been cleared yet.
 */
export const clearServerSession = async (): Promise<void> => {
  if (typeof window === "undefined") {
    return;
  }

  const token = getAccessToken();
  try {
    await fetch(STATIC_ENDPOINTS.AUTH.SIGN_OUT, {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch {
    // Network failure — the cookie expires on its own; local state is
    // still cleared by the caller.
  }
};

const clearLocalAuthState = () => {
  loggedOut = true;
  clearTokens();
  refreshPromise = null;
  try {
    LEGACY_TOKEN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem("userType");
  } catch {
    // Storage unavailable — nothing to clear.
  }
};

/**
 * Called when an authenticated request still fails after a refresh attempt:
 * the session is gone, so clear it and send the user to sign in.
 */
export const handleTokenExpiration = async () => {
  if (isHandlingAuthError || typeof window === "undefined") {
    return;
  }

  isHandlingAuthError = true;

  // Read before clearing: it decides which sign-in screen to return to.
  const signInRoute = getSignInRoute();

  await clearServerSession();
  clearLocalAuthState();

  const currentPath = window.location.pathname;
  const isAuthPage =
    currentPath.includes("/auth") ||
    currentPath.includes("/join") ||
    currentPath.includes("/reset-password");

  if (!isAuthPage) {
    window.location.replace(signInRoute);
  }

  setTimeout(() => {
    isHandlingAuthError = false;
  }, 1000);
};

/**
 * Clears auth state (memory, cookie, storage), optional query cache, and
 * redirects to sign-in.
 */
export const performLogout = async (
  queryClient?: QueryClient,
  redirectTo?: string,
) => {
  if (typeof window === "undefined") {
    return;
  }

  // Read before clearing: it decides which sign-in screen to return to.
  const signInRoute = getSignInRoute();

  await clearServerSession();
  clearLocalAuthState();

  const authKeys = ["pendingUser:v1", "profileCompletionEmail"];

  authKeys.forEach((key) => {
    localStorage.removeItem(key);
  });

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith("cached-") ||
          key.includes("auth") ||
          key.includes("token") ||
          key.includes("user"))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Silently handle errors when clearing cache
  }

  try {
    sessionStorage.clear();
  } catch {
    // Silently handle errors when clearing sessionStorage
  }

  if (queryClient) {
    try {
      queryClient.clear();
      queryClient.resetQueries();
    } catch {
      // Silently handle errors when clearing query cache
    }
  }

  isHandlingAuthError = false;

  const redirectPath = redirectTo || signInRoute;
  window.location.replace(redirectPath);
};
