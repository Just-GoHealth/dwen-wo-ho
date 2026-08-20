import { toast } from "sonner";
import { PUBLIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";
import { API_BASE_URL } from "@/configs/config";

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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  const headers: Record<string, string> = {
    Accept: "*/*",
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // For provider signup flow, prioritize token from OTP verification over refreshToken
  // Token is set after OTP verification and should be used for subsequent signup requests
  // After signin endpoint returns refreshToken, we switch to using refreshToken
  if (!headers.Authorization && !isPublicEndpoint(endpoint)) {
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (refreshToken) {
      headers.Authorization = `Bearer ${refreshToken}`;
    }
  }

  return headers;
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

export async function api(endpoint: string, options: RequestInit = {}) {
  const body = prepareRequestBody(options.body);
  const headers = prepareHeaders(endpoint, { ...options, body });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
      if (isAuthError(response.status) && !isPublicEndpoint(endpoint)) {
        if (typeof window !== "undefined") {
          toast.error("Your session has expired. Please log in again.");
          // Lazy import avoids circular dependency with lib/auth/session.
          void import("@/lib/auth/session").then((mod) =>
            mod.handleTokenExpiration(),
          );
        }
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
