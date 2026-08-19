"use client";

import { useCallback, useRef } from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  curatorNotificationListAtom,
  isCuratorNotificationSheetOpenAtom,
  providerNotificationListAtom,
  isProviderNotificationSheetOpenAtom,
} from "@/atoms/notification";
import { unreadCountAtom } from "@/atoms/websocket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { providerDashboardService } from "@/services/provider/dashboard";
import { curatorService } from "@/services/curator";
import { getUserType } from "@/lib/utils/auth/get-user-type";
import {
  CuratorNotification,
  CuratorNotificationListResponse,
  ProviderNotification,
  ProviderNotificationListResponse,
} from "@/lib/types/entities/notification";
import { Route } from "next";
import { usePathname } from "next/navigation";
import { parseWsNotificationEvent } from "@/lib/utils/notifications/ws-handler";
import { getNotificationToastContent } from "@/lib/utils/notifications/toast-content";
import { useNotificationQuerySeed } from "@/hooks/shared/use-notification-query-seed";
import { useNotificationWsSubscription } from "@/hooks/realtime/use-notification-ws-subscription";

export function useNotificationWebSocket() {
  const pathname = usePathname();
  // Re-evaluate user type when route changes (e.g. after login)
  void pathname;
  const userType = getUserType();

  const [curatorNotifications, setCuratorNotifications] = useAtom(
    curatorNotificationListAtom,
  );
  const [providerNotifications, setProviderNotifications] = useAtom(
    providerNotificationListAtom,
  );
  const [, setCuratorSheetOpen] = useAtom(isCuratorNotificationSheetOpenAtom);
  const [, setProviderSheetOpen] = useAtom(isProviderNotificationSheetOpenAtom);

  const notifications =
    userType === "curator" ? curatorNotifications : providerNotifications;
  const setSheetOpen =
    userType === "curator" ? setCuratorSheetOpen : setProviderSheetOpen;
  const [unreadCount, setUnreadCount] = useAtom(unreadCountAtom);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: curatorData, refetch: refetchCurator } = useQuery<
    CuratorNotificationListResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.curator, "notifications"],
    queryFn: () => curatorService.getNotifications(),
    staleTime: 5 * 60 * 1000,
    enabled: userType === "curator",
  });

  const { data: providerData, refetch: refetchProvider } = useQuery<
    ProviderNotificationListResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.providers, "notifications"],
    queryFn: () => providerDashboardService.getNotifications(),
    staleTime: 5 * 60 * 1000,
    enabled: userType === "provider",
  });

  const initialNotifications =
    userType === "curator" ? curatorData?.data?.items : providerData?.items;

  useNotificationQuerySeed({
    userType,
    initialNotifications,
    curatorUnreadCount: curatorData?.data?.unreadCount,
    providerUnreadCount: providerData?.unreadCount,
    setCuratorNotifications,
    setProviderNotifications,
    setUnreadCount,
  });

  // Guards against the socket redelivering the same notification (reconnect
  // replay, duplicate emission, multiple tabs) — without this, every
  // redelivery re-pops the toast and sheet for something the provider/
  // curator has already seen, which reads as popping up "randomly".
  const seenNotificationIdsRef = useRef<Set<string>>(new Set());

  const handleNotification = useCallback(
    (event: Event) => {
      console.log(`[NotificationWebSocket] 📥 Received ws:notification`, event);
      if (userType !== "curator" && userType !== "provider") return;

      const parsed = parseWsNotificationEvent(event, userType);
      if (!parsed) return;

      const { notification, unreadCount: newUnreadCount, link } = parsed;

      const notificationId =
        userType === "curator"
          ? (notification as CuratorNotification).id
          : (notification as ProviderNotification).notificationId;

      if (
        notificationId &&
        seenNotificationIdsRef.current.has(notificationId)
      ) {
        console.log(
          "[NotificationWebSocket] Ignoring duplicate redelivery of",
          notificationId,
        );
        return;
      }
      if (notificationId) {
        seenNotificationIdsRef.current.add(notificationId);
      }

      if (userType === "curator") {
        setCuratorNotifications((prev) => [
          notification as CuratorNotification,
          ...prev,
        ]);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.curator, "notifications"],
        });
      } else {
        setProviderNotifications((prev) => [
          notification as ProviderNotification,
          ...prev,
        ]);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.providers, "notifications"],
        });
      }

      setUnreadCount(newUnreadCount);

      const { title, description, type } = getNotificationToastContent(
        notification,
        userType,
      );
      const toastFn = type === "error" ? toast.error : toast.info;

      toastFn(title, {
        description,
        duration: 5000,
        action: link
          ? {
              label: "View",
              onClick: () => {
                router.push(link as Route);
              },
            }
          : undefined,
      });

      console.log(
        "[NotificationWebSocket] Triggering global refetch after notification...",
      );
      queryClient.refetchQueries({ type: "active" });

      setTimeout(() => setSheetOpen(true), 500);
    },
    [
      setCuratorNotifications,
      setProviderNotifications,
      setUnreadCount,
      setSheetOpen,
      router,
      queryClient,
      userType,
    ],
  );

  const handleUnreadCountChange = useCallback(
    (event: Event) => {
      const customEvent = event as CustomEvent<{ unreadCount: number }>;
      setUnreadCount(customEvent.detail.unreadCount);
    },
    [setUnreadCount],
  );

  const handleReconnect = useCallback(() => {
    console.log(
      "[NotificationWebSocket] Reconnect detected - re-fetching notifications",
    );
    if (userType === "curator") {
      refetchCurator();
    } else if (userType === "provider") {
      refetchProvider();
    }
  }, [userType, refetchCurator, refetchProvider]);

  useNotificationWsSubscription({
    onNotification: handleNotification,
    onUnreadCountChange: handleUnreadCountChange,
    onReconnect: handleReconnect,
  });

  return {
    notifications,
    unreadCount,
    userType,
  };
}
