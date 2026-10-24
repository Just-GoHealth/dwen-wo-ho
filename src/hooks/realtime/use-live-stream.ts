"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  openSharedLiveStream,
  subscribeLiveEvents,
  subscribeLiveResync,
} from "@/lib/v2/stream";
import { getStoredUserType } from "@/lib/utils/auth/get-user-type";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import type { SseNotification, UnreadCounts } from "@/lib/v2/types";
import { JUST_IN_QUERY_KEY } from "@/hooks/curator/providers/use-just-in";

const V2 = QUERY_KEYS.v2;

// Auth screens have no session yet; the stream would only 401.
const isAuthScreen = (path: string) =>
  path.includes("/auth") ||
  path.includes("/signup") ||
  path.includes("/new-password") ||
  path === "/" ||
  !(path.startsWith("/provider") || path.startsWith("/curator"));

/**
 * Keeps one `GET /me/stream` open per tab while signed in, and maps its
 * events onto the React Query cache:
 * - `notification`: badge = its `unread`, refetch the list (and results for
 *   result-bearing types), and toast it.
 * - `just-in` (curator): refetch the Just In queue and provider lists.
 * - `provider-status`: refetch the provider profile; the pending screen
 *   routes on it (see usePendingApproval).
 * - reopen after a refresh: resync `/me/notifications/counts`.
 */
export function useLiveStream() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const enabled =
    !!pathname && !isAuthScreen(pathname) && !!getStoredUserType();

  useEffect(() => {
    if (!enabled) return;
    return openSharedLiveStream();
  }, [enabled]);

  useEffect(() => {
    const offEvents = subscribeLiveEvents((name, data) => {
      if (name === "notification") {
        const n = data as SseNotification;
        queryClient.setQueryData<UnreadCounts>(
          V2.notificationCounts,
          (prev) => ({
            total: n.unread,
            campuses: prev?.campuses ?? [],
          }),
        );
        void queryClient.invalidateQueries({ queryKey: V2.notifications });
        void queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.curator, "notifications"],
        });
        if (
          n.type === "NEW_RESULTS" ||
          n.type === "URGENT_RESULT" ||
          n.type === "RESULT_OVERDUE" ||
          n.type === "PROVIDER_ADDED" ||
          n.type === "PROVIDER_REMOVED"
        ) {
          void queryClient.invalidateQueries({ queryKey: V2.myCampuses });
          void queryClient.invalidateQueries({ queryKey: V2.results });
          void queryClient.invalidateQueries({ queryKey: V2.urgentResults });
        }
        if (n.type === "URGENT_RESULT" || n.type === "RESULT_OVERDUE") {
          toast.error(n.title);
        } else {
          toast.info(n.title);
        }
      } else if (name === "just-in") {
        // Curator only: the Just In queue changed ({pending, targetId}).
        void queryClient.invalidateQueries({ queryKey: JUST_IN_QUERY_KEY });
        void queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.providers],
        });
      } else if (name === "provider-status") {
        void queryClient.invalidateQueries({ queryKey: V2.providerMe });
        void queryClient.invalidateQueries({ queryKey: V2.me });
      }
    });
    const offResync = subscribeLiveResync(() => {
      void queryClient.invalidateQueries({ queryKey: V2.notificationCounts });
    });
    return () => {
      offEvents();
      offResync();
    };
  }, [queryClient]);
}
