"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationsApi } from "@/lib/v2/notifications";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { describeApiError } from "@/lib/utils/shared/api-error";
import type { Notification, Page, UnreadCounts } from "@/lib/v2/types";

const V2 = QUERY_KEYS.v2;
const LIST_SIZE = 50;

/**
 * Provider notifications: `GET /me/notifications` (newest first) and the
 * unread badge from `/counts`, kept live by the SSE `notification` event
 * (see useLiveStream). There is no delete in v2; "clear all" marks read.
 */
export function useProviderDashboardNotifications(enabled = true) {
  const queryClient = useQueryClient();

  const { data: page } = useQuery({
    queryKey: V2.notifications,
    queryFn: () => notificationsApi.list({ size: LIST_SIZE }),
    staleTime: 60 * 1000,
    enabled,
  });
  const { data: counts } = useQuery({
    queryKey: V2.notificationCounts,
    queryFn: notificationsApi.counts,
    staleTime: 60 * 1000,
    enabled,
  });

  const markLocally = useCallback(
    (match: (n: Notification) => boolean) => {
      const now = new Date().toISOString();
      queryClient.setQueryData<Page<Notification>>(V2.notifications, (prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((n) =>
                match(n) && !n.readAt ? { ...n, readAt: now } : n,
              ),
            }
          : prev,
      );
    },
    [queryClient],
  );

  const resync = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: V2.notifications }),
      queryClient.invalidateQueries({ queryKey: V2.notificationCounts }),
    ]);

  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markRead,
    onMutate: (id) => {
      markLocally((n) => n.id === id);
      queryClient.setQueryData<UnreadCounts>(V2.notificationCounts, (prev) =>
        prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev,
      );
    },
    onError: (error) => toast.error(describeApiError(error).message),
    onSettled: resync,
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onMutate: () => {
      markLocally(() => true);
      queryClient.setQueryData<UnreadCounts>(V2.notificationCounts, (prev) =>
        prev ? { total: 0, campuses: [] } : prev,
      );
    },
    onError: (error) => toast.error(describeApiError(error).message),
    onSettled: resync,
  });

  const markOneRead = useCallback(
    async (id: string | number) => {
      await markReadMutation.mutateAsync(String(id));
    },
    [markReadMutation],
  );

  const markAllRead = useCallback(async () => {
    await markAllMutation.mutateAsync();
  }, [markAllMutation]);

  return {
    notifications: page?.items ?? [],
    unreadCount: counts?.total ?? 0,
    markAllRead,
    markOneRead,
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllMutation.isPending,
  };
}
