"use client";

import { useAtom, useSetAtom } from "jotai";

import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { unifiedNotificationsService } from "@/services/shared/unified-notifications";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  curatorNotificationListAtom,
  isCuratorNotificationSheetOpenAtom,
} from "@/atoms/notification";

import { CuratorNotification } from "@/lib/types/entities/notification";
import type { Route } from "next";

import {
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "@/hooks/queries/use-notifications-mutations";

export const useCuratorNotification = () => {
  const [notifications, setNotifications] = useAtom(
    curatorNotificationListAtom,
  );

  const setIsOpen = useSetAtom(isCuratorNotificationSheetOpenAtom);

  const router = useRouter();

  const markReadMutation = useMarkNotificationReadMutation();

  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  // v2 `/me/notifications`; refetched by the SSE `notification` event.
  const { data: fetched } = useQuery({
    queryKey: [QUERY_KEYS.curator, "notifications"],
    queryFn: unifiedNotificationsService.getNotifications,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (fetched?.data?.items) setNotifications(fetched.data.items);
  }, [fetched, setNotifications]);

  const openSheet = useCallback(() => setIsOpen(true), [setIsOpen]);

  const closeSheet = useCallback(() => setIsOpen(false), [setIsOpen]);

  const toggleSheet = useCallback(
    () => setIsOpen((prev) => !prev),

    [setIsOpen],
  );

  const addNotification = useCallback(
    (type: "success" | "error" | "info", message: string, link?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      // Map toast types to CuratorNotification structure
      const notificationTypeMap: Record<string, string> = {
        success: "ADMIN_ACTION_REQUIRED",
        error: "CRITICAL_ALERT",
        info: "PROVIDER_REGISTRATION",
      };

      const newNotification: CuratorNotification = {
        id,
        type: notificationTypeMap[type] as CuratorNotification["type"],
        title: type.charAt(0).toUpperCase() + type.slice(1),
        message,
        createdAt: new Date().toISOString(),
        relatedEntityId: id,
        relatedEntityType: "notification",
        action: "",
        notification: message,
        emoji: type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️",
        schoolId: 0,
        read: false,
        link: link as CuratorNotification["link"],
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Add a slight delay before opening the sheet so the toast appears first

      setTimeout(() => {
        setIsOpen(true);
      }, 500);

      const handleToastAction = () => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );

        if (link) {
          router.push(link as Route);
        } else {
          setIsOpen(true);
        }
      };

      if (type === "success") {
        toast.success(message, {
          action: {
            label: "Open",
            onClick: handleToastAction,
          },
        });
      } else if (type === "error") {
        toast.error(message, {
          action: {
            label: "Open",
            onClick: handleToastAction,
          },
        });
      } else {
        toast.info(message, {
          action: {
            label: "Open",
            onClick: handleToastAction,
          },
        });
      }
    },

    [setNotifications, setIsOpen, router],
  );

  // TODO(v2-backend): v2 has no clear-all endpoint (v1 DELETE /curator/notifications);
  // this only empties the list on this device until the next fetch.
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  const dismissNotification = useCallback(
    (id: string | number) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },

    [setNotifications],
  );

  const markAsRead = useCallback(
    (id: string | number) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );

      if (typeof id === "string") markReadMutation.mutate(id);
    },

    [setNotifications, markReadMutation],
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    markAllReadMutation.mutate();
  }, [setNotifications, markAllReadMutation]);

  // TODO(v2-backend): v2 has no delete-one endpoint (v1 DELETE /curator/notifications/{id});
  // the sheet hides the delete action, so this only dismisses locally.
  const deleteNotification = useCallback(
    (id: string | number) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },

    [setNotifications],
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,

    addNotification,

    clearNotifications,

    dismissNotification,

    markAsRead,

    markAllAsRead,

    deleteNotification,

    unreadCount,

    setIsOpen,

    openSheet,

    closeSheet,

    toggleSheet,

    // Loading states for UI feedback
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
    isDeleting: false,
    isClearing: false,
  };
};
