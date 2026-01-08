const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://justgo.up.railway.app";

const PUBLIC_ENDPOINTS = [
  "/api/v1/auth/check-email",
  "/api/v1/auth/sign-in",
  "/api/v1/auth/create-account",
  "/api/v1/auth/submit-signup-code",
  "/api/v1/email/send-verification",
  "/api/v1/auth/recover-account",
  "/api/v1/auth/submit-account-recovery-code",
  "/api/v1/auth/reset-password",
];

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

const prepareHeaders = (endpoint: string, options: RequestInit): Record<string, string> => {
  const token = typeof window !== "undefined" 
    ? localStorage.getItem("token") || localStorage.getItem("curatorToken")
    : null;
  const headers: Record<string, string> = {
    Accept: "*/*",
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token && !headers.Authorization && !isPublicEndpoint(endpoint)) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const extractErrorFromResponse = async (response: Response): Promise<Error> => {
  const responseText = await response.text();
  const isExpectedFlow = 
    responseText.includes("ACCOUNT PENDING") || 
    responseText.includes("User not found");

  if (!isExpectedFlow) {
    console.error(`API Error [${response.status}]:`, responseText);
  }

  try {
    const errorData = JSON.parse(responseText);
    return new Error(JSON.stringify(errorData));
  } catch {
    return new Error(responseText || `API request failed with status ${response.status}`);
  }
};

const parseSuccessResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await response.json();
    return { success: true, message: data.message, data: data.data };
  }
  return { success: true, message: "Success", data: null };
};

export async function api(endpoint: string, options: RequestInit = {}) {
  const body = prepareRequestBody(options.body);
  const headers = prepareHeaders(endpoint, { ...options, body });

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      body,
    });

    if (!response.ok) {
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
