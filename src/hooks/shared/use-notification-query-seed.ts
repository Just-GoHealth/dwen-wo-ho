"use client";

import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  CuratorNotification,
  ProviderNotification,
} from "@/lib/types/entities/notification";
import type { NotificationUserType } from "@/lib/types/notifications/ws-handler";

interface UseNotificationQuerySeedOptions {
  userType: NotificationUserType | null;
  initialNotifications:
    CuratorNotification[] | ProviderNotification[] | undefined;
  curatorUnreadCount: number | undefined;
  providerUnreadCount: number | undefined;
  setCuratorNotifications: Dispatch<SetStateAction<CuratorNotification[]>>;
  setProviderNotifications: Dispatch<SetStateAction<ProviderNotification[]>>;
  setUnreadCount: Dispatch<SetStateAction<number>>;
}

/**
 * Seeds notification atoms from HTTP query results on initial load and refetch.
 */
export function useNotificationQuerySeed({
  userType,
  initialNotifications,
  curatorUnreadCount,
  providerUnreadCount,
  setCuratorNotifications,
  setProviderNotifications,
  setUnreadCount,
}: UseNotificationQuerySeedOptions) {
  useEffect(() => {
    if (!initialNotifications) return;

    if (userType === "curator") {
      setCuratorNotifications(initialNotifications as CuratorNotification[]);
      setUnreadCount(curatorUnreadCount || 0);
      return;
    }

    if (userType === "provider") {
      setProviderNotifications(initialNotifications as ProviderNotification[]);
      setUnreadCount(providerUnreadCount || 0);
    }
  }, [
    initialNotifications,
    setCuratorNotifications,
    setProviderNotifications,
    setUnreadCount,
    userType,
    curatorUnreadCount,
    providerUnreadCount,
  ]);
}
