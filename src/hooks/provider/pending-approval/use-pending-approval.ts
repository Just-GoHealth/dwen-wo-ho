"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { toast } from "sonner";
import {
  useProviderMe,
  useResubmitApplication,
} from "@/hooks/queries/use-provider-me";
import { subscribeLiveEvents } from "@/lib/v2/stream";
import { routeForProviderNext } from "@/lib/utils/auth/provider-next-route";
import { describeApiError } from "@/lib/utils/shared/api-error";
import { ROUTES } from "@/lib/constants/infra/routes";
import { ApiError } from "@/lib/v2/http";
import type { SseProviderStatus } from "@/lib/v2/types";

/** Fallback poll while the page is visible (the guide asks for 30–60 s). */
export const PENDING_POLL_MS = 45_000;

const usePageVisible = () => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
};

/**
 * The pending / rejected application page. Updates without a reload: live
 * through the SSE `provider-status` event, with `GET /providers/me` every
 * 45 s while visible as the fallback. Either way, route by `next`.
 */
export function usePendingApproval() {
  const router = useRouter();
  const visible = usePageVisible();
  const {
    data: profile,
    isLoading,
    error,
  } = useProviderMe({
    refetchInterval: visible ? PENDING_POLL_MS : false,
  });
  const resubmitMutation = useResubmitApplication();

  useEffect(
    () =>
      subscribeLiveEvents((name, data) => {
        if (name !== "provider-status") return;
        const { next } = data as SseProviderStatus;
        router.replace(routeForProviderNext(next) as Route);
      }),
    [router],
  );

  useEffect(() => {
    if (error instanceof ApiError && error.code === "NOT_SIGNED_IN") {
      router.replace(ROUTES.provider.signIn as Route);
      return;
    }
    if (profile && profile.next !== "PENDING" && profile.next !== "REJECTED") {
      router.replace(routeForProviderNext(profile.next) as Route);
    }
  }, [error, profile, router]);

  /** `onIncomplete` gets the first missing field from PROFILE_INCOMPLETE. */
  const resubmit = async (onIncomplete?: (field: string | null) => void) => {
    try {
      const updated = await resubmitMutation.mutateAsync();
      router.replace(routeForProviderNext(updated.next) as Route);
    } catch (err) {
      toast.error(describeApiError(err).message);
      if (err instanceof ApiError && err.code === "PROFILE_INCOMPLETE") {
        onIncomplete?.(err.fields[0]?.field ?? null);
      }
    }
  };

  return {
    profile,
    isLoading,
    status: profile?.status === "REJECTED" ? "REJECTED" : "PENDING",
    resubmit,
    isResubmitting: resubmitMutation.isPending,
  } as const;
}
