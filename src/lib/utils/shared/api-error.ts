/** The `api()` client wraps a failed response's JSON body as
 * `new Error(JSON.stringify(body))` — this unwraps it back out so callers
 * can branch on a structured `errorCode` and show a real message instead
 * of a raw JSON blob. */
export function parseApiError(error: unknown): {
  code: string | null;
  message: string;
} {
  const fallback = error instanceof Error ? error.message : "Something went wrong";
  if (!(error instanceof Error)) return { code: null, message: fallback };

  try {
    const parsed = JSON.parse(error.message) as {
      data?: { errorCode?: string; message?: string };
      message?: string;
    };
    return {
      code: parsed.data?.errorCode ?? null,
      message: parsed.data?.message ?? parsed.message ?? fallback,
    };
  } catch {
    return { code: null, message: fallback };
  }
}
