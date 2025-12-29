const API_BASE =
  process.env.NODE_ENV === "development"
    ? "" // Use proxy in development
    : process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://justgo.up.railway.app";

export async function api(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set Content-Type to application/json if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";

    if (
      options.body &&
      typeof options.body === "object" &&
      !(options.body instanceof Blob) &&
      !(options.body instanceof URLSearchParams)
    ) {
      options.body = JSON.stringify(options.body);
    }
  }

  const publicEndpoints = [
    "/api/v1/auth/check-email",
    "/api/v1/auth/curator/check-email",
    "/api/v1/auth/sign-in",
    "/api/v1/auth/create-account",
    "/api/v1/auth/curator/sign-in",
    "/api/v1/auth/submit-signup-code",
    "/api/v1/auth/recover-account",
    "/api/v1/auth/submit-account-recovery-code",
    "/api/v1/auth/reset-password",
  ];

  const isPublicEndpoint = publicEndpoints.some((path) =>
    endpoint.includes(path)
  );

  if (token && !headers.Authorization && !isPublicEndpoint) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }
    return response.json();
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    throw new Error(error?.message || "Network error");
  }
}
