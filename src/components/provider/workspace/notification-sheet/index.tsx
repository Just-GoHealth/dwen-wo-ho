import NotificationsSheet from "@/components/shared/notification-sheet";
import {
  getProviderNotificationEmoji,
  getProviderNotificationRoute,
} from "@/lib/config/provider-notification-route";
import { isProviderNotificationSheetOpenAtom } from "@/atoms/notification";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import type { Notification } from "@/lib/v2/types";

/** v2 notifications in the shared sheet (read and read-all only). */
export default function ProviderNotificationsSheet({
  notifications,
  setNotifOpen,
  markAllRead,
  markOneRead,
  router,
  isMarkingRead,
  isMarkingAllRead,
}: {
  notifications: Notification[];
  setNotifOpen: (open: boolean) => void;
  markAllRead: () => void;
  markOneRead: (id: string | number) => void;
  router: ReturnType<typeof useRouter>;
  isMarkingRead: boolean;
  isMarkingAllRead: boolean;
}) {
  return (
    <NotificationsSheet<Notification>
      notifications={notifications}
      openAtom={isProviderNotificationSheetOpenAtom}
      onOpenChange={setNotifOpen}
      markAllRead={markAllRead}
      markOneRead={markOneRead}
      // TODO(v2-backend): no delete or clear-all endpoint; both are hidden.
      onNavigate={(link) => router.push(link as Route)}
      getNotificationActionUrl={(n) => getProviderNotificationRoute(n) ?? "#"}
      isMarkingRead={isMarkingRead}
      isDeleting={false}
      isMarkingAllRead={isMarkingAllRead}
      getNotificationId={(n) => n.id}
      isNotificationUnread={(n) => !n.readAt}
      getAvatarUrl={() => null}
      getEmoji={getProviderNotificationEmoji}
      getTitle={(n) => n.title}
      getText={(n) => n.body}
      getTimestamp={(n) => n.createdAt}
    />
  );
}
