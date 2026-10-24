"use client";

import { useCallback, useState } from "react";
import { useCountdown } from "@just-gohealth/ui";
import {
  describeApiError,
  type DescribedApiError,
} from "@/lib/utils/shared/api-error";

/**
 * Holds the last API error a form hit, with the RATE_LIMITED countdown:
 * while `isRateLimited`, disable the submit button and show
 * `formatCountdown(secondsLeft)`.
 */
export function useApiError() {
  const [error, setError] = useState<DescribedApiError | null>(null);
  const { secondsLeft, restart } = useCountdown(0);

  const capture = useCallback(
    (raw: unknown): DescribedApiError => {
      const described = describeApiError(raw);
      setError(described);
      if (described.code === "RATE_LIMITED") {
        restart(Math.max(1, described.retryAfter ?? 60));
      }
      return described;
    },
    [restart],
  );

  const clear = useCallback(() => setError(null), []);

  return {
    error,
    capture,
    clear,
    fieldError: (field: string) => error?.fieldError(field),
    secondsLeft,
    isRateLimited: secondsLeft > 0,
  };
}
