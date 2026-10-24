"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";

import NotificationsSheet from "@/components/shared/notification-sheet";
import { useCuratorNotification } from "@/hooks/curator/notification/use-notification";
import { isCuratorNotificationSheetOpenAtom } from "@/atoms/notification";
import { getCuratorNotificationRoute } from "@/lib/config/notification-routing";
import type { CuratorNotification } from "@/lib/types/entities/notification";

export function CuratorNotificationsHost() {
  const router = useRouter();
  const {
    notifications,
    setIsOpen,
    markAsRead,
    markAllAsRead,
    isMarkingRead,
    isMarkingAllRead,
  } = useCuratorNotification();

  return (
    <NotificationsSheet<CuratorNotification>
      notifications={notifications}
      openAtom={isCuratorNotificationSheetOpenAtom}
      onOpenChange={setIsOpen}
      markAllRead={markAllAsRead}
      markOneRead={markAsRead}
      // TODO(v2-backend): no v2 delete-one or clear-all endpoint, so both
      // actions are hidden (clearAllNotifications omitted).
      isMarkingRead={isMarkingRead}
      isMarkingAllRead={isMarkingAllRead}
      onNavigate={(link) => router.push(link as Route)}
      getNotificationActionUrl={(n) =>
        n.link ?? getCuratorNotificationRoute(n) ?? "#"
      }
      getNotificationId={(n) => n.id}
      isNotificationUnread={(n) => !n.read}
      getAvatarUrl={() => undefined}
      getEmoji={(n) => n.emoji}
      getTitle={(n) => n.title}
      getText={(n) => n.message}
      getTimestamp={(n) => n.createdAt}
    />
  );
}
