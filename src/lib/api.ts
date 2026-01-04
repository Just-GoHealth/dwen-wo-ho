const API_BASE =
  process.env.NODE_ENV === "development"
    ? "" // Use proxy in development
    : process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://justgo.up.railway.app";

export async function api(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    Accept: "*/*",
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
    "/api/v1/email/send-verification",
    "/api/v1/auth/recover-account",
    "/api/v1/auth/submit-account-recovery-code",
    "/api/v1/auth/reset-password",
  ];

  const isPublicEndpoint = publicEndpoints.some((path) =>
    endpoint.includes(path)
  );

  if (token && !headers.Authorization && !isPublicEndpoint) {
    headers.Authorization = `Bearer ${token}`;
    console.log(`🔒 Attaching Bearer token to request: ${endpoint}`);
  } else {
    if (!token) console.log("⚠️ No token found in localStorage");
    if (isPublicEndpoint) console.log(`🔓 Public endpoint, skipping token: ${endpoint}`);
  }


  try {
    console.log("🌐 API Request:", {
      url: `${API_BASE}${endpoint}`,
      method: options.method,
      headers,
      body: options.body,
    });

    // Debug logging for request details
    if (options.body instanceof FormData) {
      console.log("📤 Body is FormData");
      // Log FormData keys (cannot log values easily for files)
      const keys = [];
      for (const key of (options.body as FormData).keys()) {
        keys.push(key);
      }
      console.log("📤 FormData Keys:", keys);
    } else {
      console.log("Is FormData?", options.body instanceof FormData); // Should be false here
    }
    console.log("📤 Final Request Headers:", headers);

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    console.log("🌐 Response Status:", response.status, response.statusText);

    if (!response.ok) {
      // Read response as text first, then try to parse as JSON
      const responseText = await response.text();

      // Check if it's a pending account response (expected flow, not a critical error)
      const isPending = responseText.includes("ACCOUNT PENDING");
      // Check if it's a user not found response (expected flow for check-email, redirects to signup)
      const isUserNotFound = responseText.includes("User not found");

      if (isPending) {
        console.warn("⚠️ API Response (Account Pending):", responseText);
      } else if (isUserNotFound) {
        console.warn("ℹ️ API Response (User Not Found - Proceeding to Signup):", responseText);
      } else {
        console.error("❌ API Error Response:", responseText);
      }

      try {
        const error = JSON.parse(responseText);
        if (!isPending && !isUserNotFound) {
          console.error("❌ API Error (parsed as JSON):", error);
        }
        // Throw the error payload as a stringified JSON if it's an object, 
        // or just the message property if distinct. 
        // Returning the full object string matches how we parse it in signin.tsx
        throw new Error(JSON.stringify(error));
      } catch (parseError) {
        // If JSON parsing fails, use the raw text
        if (!isPending && !isUserNotFound) {
          console.error("❌ API Error (raw text):", responseText);
        }
        // Re-throw the original error if it was already thrown above (which is wrapped in Error)
        // or throw a new one if this is the catch block for JSON.parse
        if (parseError instanceof Error && parseError.message.startsWith("{")) {
          throw parseError;
        }
        throw new Error(responseText || "API request failed");
      }
    }

    // Try to parse response as JSON, fallback to returning success object with text
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      // If not JSON, return the text wrapped in a success object
      const text = await response.text();
      return { success: true, message: text };
    }
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any)?.message || "Network error");
  }
}
