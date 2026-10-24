"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { unifiedNotificationsService } from "@/services/shared/unified-notifications";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";

// TODO(v2-curator): curator-only now; providers use useProviderDashboardNotifications (v2).
const getNotificationsQueryKey = () => [QUERY_KEYS.curator, "notifications"];

/**
 * Mark a single notification as read.
 * Works for both curators (PUT /curator/notifications/mark-read)
 * and providers (PATCH /providers/notifications/:id/read)
 */
export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      unifiedNotificationsService.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getNotificationsQueryKey() });
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to mark notification read"),
  });
};

/**
 * Mark all notifications as read.
 * Works for both curators (PUT /curator/notifications/mark-all-read)
 * and providers (PATCH /providers/notifications/read-all)
 */
export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => unifiedNotificationsService.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getNotificationsQueryKey() });
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to mark all read"),
  });
};

/**
 * Delete a single notification.
 * Curator: ✅ Real endpoint DELETE /curator/notifications/:id
 * Provider: 🔧 Dummy (endpoint not implemented yet)
 */
export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      unifiedNotificationsService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getNotificationsQueryKey() });
      toast.success("Notification deleted");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to delete notification"),
  });
};

/**
 * Clear all notifications.
 * Curator: 🔧 Workaround (deletes one-by-one, bulk endpoint not implemented)
 * Provider: ✅ Real endpoint DELETE /providers/notifications
 */
const useClearAllNotificationsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => unifiedNotificationsService.clearAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getNotificationsQueryKey() });
      toast.success("All notifications cleared");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to clear notifications"),
  });
};

/**
 * Alias for useClearAllNotificationsMutation to maintain backward compatibility
 * with existing imports from use-provider.ts
 */
export const useClearNotificationsMutation = useClearAllNotificationsMutation;
