import { toast } from "sonner";
import { API_BASE_URL } from "@/configs/config";
import {
  ApiError,
  ensureCsrf,
  readCookie,
  refreshSession,
  type Problem,
} from "@/lib/v2/http";
import { handleSessionExpired } from "@/lib/auth/session";

/**
 * TODO(v2-curator): legacy envelope client (`{success, message, data}`) kept
 * only for curator screens that still call /api/v1 paths. Provider code uses
 * `@/lib/v2/*`. There are no tokens here any more: the backend's HttpOnly
 * cookies carry the session, unsafe calls echo XSRF-TOKEN, and a 401 runs
 * the shared single-flight `refreshSession()` once before giving up.
 */
const getBaseUrl = (): string =>
  typeof window === "undefined" ? API_BASE_URL : "";

const UNSAFE = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const prepareRequestBody = (body: unknown): BodyInit | undefined => {
  if (!body) return undefined;
  if (body instanceof FormData) return body;
  if (body instanceof Blob) return body;
  if (body instanceof URLSearchParams) return body;
  if (typeof body === "object") return JSON.stringify(body);
  return body as BodyInit;
};

const prepareHeaders = (
  method: string,
  options: RequestInit,
): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "*/*",
    ...(options.headers as Record<string, string>),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const csrf = readCookie("XSRF-TOKEN");
  if (UNSAFE.has(method) && csrf) headers["X-XSRF-TOKEN"] = csrf;
  return headers;
};

/** Error responses become `ApiError` (RFC 9457 `code`/`detail`/`fields`). */
const toApiError = async (response: Response): Promise<ApiError> => {
  let problem: Problem = { status: response.status };
  try {
    const body = (await response.json()) as Partial<Problem> & {
      message?: string;
    };
    problem = {
      ...body,
      detail: body.detail ?? body.message,
      status: body.status ?? response.status,
    };
  } catch {
    // Non-JSON error body.
  }
  const retryAfter = Number(response.headers.get("Retry-After"));
  return new ApiError(
    problem,
    Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : undefined,
  );
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
  const method = (options.method || "GET").toUpperCase();
  if (UNSAFE.has(method) && typeof window !== "undefined") await ensureCsrf();
  const body = prepareRequestBody(options.body);
  const headers = prepareHeaders(method, { ...options, body });

  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
    body,
  });

  if (response.ok) return parseSuccessResponse(response);

  if (response.status === 401 && typeof window !== "undefined") {
    if (!isRetryAfterRefresh && (await refreshSession())) {
      return api(endpoint, options, true);
    }
    handleSessionExpired();
  } else if (response.status === 403 && method !== "GET") {
    toast.error("You don't have permission to perform this action.");
  }

  throw await toApiError(response);
}
