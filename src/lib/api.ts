const API_BASE =
  process.env.NODE_ENV === "development"
    ? "" // Use proxy in development
    : process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://justgo-api.up.railway.app";

export async function api(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set Content-Type to application/json if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
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
  } catch (error: any) {
    throw new Error(error?.message || "Network error");
  }
}
