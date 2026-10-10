const USER_TYPE_KEY = "userType";

/**
 * Stores the user type in localStorage
 * @param userType - The user type to store
 */
export const setUserType = (userType: "curator" | "provider" | null): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (userType) {
    localStorage.setItem(USER_TYPE_KEY, userType);
  } else {
    localStorage.removeItem(USER_TYPE_KEY);
  }
};

/**
 * Gets the stored user type from localStorage
 * @returns "curator" | "provider" | null
 */
export const getStoredUserType = (): "curator" | "provider" | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(USER_TYPE_KEY) as "curator" | "provider" | null;
};

/**
 * Determines the signed-in user type.
 *
 * Tokens are no longer readable from JS (SEC-01: access token in memory,
 * refresh token in an HttpOnly cookie), so the stored user type doubles as
 * the "this browser has a session" hint. If the cookie has actually expired,
 * the first authenticated request fails its refresh and logs the user out.
 * @returns "curator" | "provider" | null
 */
export const getUserType = (): "curator" | "provider" | null =>
  getStoredUserType();

/**
 * Checks whether this browser holds a session (see getUserType).
 * @returns boolean
 */
export const hasValidToken = (): boolean => getStoredUserType() !== null;
