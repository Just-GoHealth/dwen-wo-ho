import { toast } from "sonner";
import { PUBLIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";
import { API_BASE_URL } from "@/configs/config";
import { getAccessToken } from "@/lib/auth/access-token";
import { getStoredUserType } from "@/lib/utils/auth/get-user-type";

// In the browser, requests go same-origin: the auth route handlers in
// src/app/api/v1/auth/** manage the HttpOnly refresh cookie, and every other
// /api path is proxied to the backend by the rewrite in next.config.ts.
const getBaseUrl = (): string =>
  typeof window === "undefined" ? API_BASE_URL : "";

const loadSession = () => import("@/lib/auth/session");

// Only 401 (Unauthorized) is an auth error that requires token refresh.
// 403 (Forbidden) means the user is authenticated but lacks permission.
const isAuthError = (status: number): boolean => status === 401;

const isPublicEndpoint = (endpoint: string): boolean => {
  return PUBLIC_ENDPOINTS.some((path) => endpoint.includes(path));
};

const prepareRequestBody = (body: unknown): BodyInit | undefined => {
  if (!body) return undefined;
  if (body instanceof FormData) return body;
  if (body instanceof Blob) return body;
  if (body instanceof URLSearchParams) return body;
  if (typeof body === "object") return JSON.stringify(body);
  return body as BodyInit;
};

const prepareHeaders = (
  endpoint: string,
  options: RequestInit,
): Record<string, string> => {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    Accept: "*/*",
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (!headers.Authorization && !isPublicEndpoint(endpoint) && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// After a hard reload the in-memory access token is gone; if this browser
// has a session (userType hint), re-issue it from the HttpOnly cookie before
// the first authenticated request instead of sending it unauthenticated.
const ensureAccessToken = async (endpoint: string): Promise<void> => {
  if (
    typeof window === "undefined" ||
    isPublicEndpoint(endpoint) ||
    getAccessToken() ||
    !getStoredUserType()
  ) {
    return;
  }
  const { refreshToken } = await loadSession();
  await refreshToken();
};

const extractErrorFromResponse = async (response: Response): Promise<Error> => {
  const responseText = await response.text();
  try {
    const errorData = JSON.parse(responseText);
    return new Error(JSON.stringify(errorData));
  } catch {
    return new Error(
      responseText || `API request failed with status ${response.status}`,
    );
  }
};

const parseSuccessResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await response.json();
    return {
      success: true,
      message: data.message,
      data: data.data || data,
    };
  }
  // CSV export etc. — the body is the payload itself, not a JSON envelope.
  if (
    contentType?.includes("text/csv") ||
    contentType?.includes("text/plain")
  ) {
    return { success: true, message: "Success", data: await response.text() };
  }
  return { success: true, message: "Success", data: null };
};

export async function api(
  endpoint: string,
  options: RequestInit = {},
  isRetryAfterRefresh = false,
): ReturnType<typeof parseSuccessResponse> {
  await ensureAccessToken(endpoint);
  const body = prepareRequestBody(options.body);
  const headers = prepareHeaders(endpoint, { ...options, body });

  try {
    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      ...options,
      headers,
      body,
    });

    if (!response.ok) {
      if (response.status === 403) {
        const method = (options.method || "GET").toUpperCase();
        if (method !== "GET") {
          toast.error("You don't have permission to perform this action.");
        }
      }
      if (
        isAuthError(response.status) &&
        !isPublicEndpoint(endpoint) &&
        typeof window !== "undefined"
      ) {
        // Lazy import avoids circular dependency with lib/auth/session.
        const { refreshToken, handleTokenExpiration } = await loadSession();
        // The access token may simply have expired: refresh once from the
        // HttpOnly cookie and retry before treating this as a sign-out.
        // Skipped when the caller set its own Authorization header (e.g. the
        // password-reset recovery token), which a refresh can't fix.
        const hadCallerAuth = !!(
          options.headers as Record<string, string> | undefined
        )?.Authorization;
        if (!isRetryAfterRefresh && !hadCallerAuth && (await refreshToken())) {
          return api(endpoint, options, true);
        }
        toast.error("Your session has expired. Please log in again.");
        void handleTokenExpiration();
      }
      throw await extractErrorFromResponse(response);
    }

    return await parseSuccessResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error");
  }
}
