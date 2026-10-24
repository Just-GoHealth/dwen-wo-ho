import { notificationsApi } from "@/lib/v2/notifications";
import type { Notification } from "@/lib/v2/types";
import type {
  CuratorSummary,
  SendNotificationRequest,
  MarkNotificationsReadRequest,
} from "@/lib/types/api/curator";
import type {
  CuratorNotification,
  CuratorNotificationListResponse,
} from "@/lib/types/entities/notification";
import type { Route } from "next";
import { normalizeCuratorSummary } from "@/lib/utils/curator/summary/normalize-curator-summary";
import { catalogueCurator } from "@/lib/v2/curator/catalogue";
import { networkCurator } from "@/lib/v2/curator/network";
import { joinRequestsCurator } from "@/lib/v2/curator/providers";

/** Curator screens for a v2 notification (its `link` is an API path). */
function curatorLinkFor(n: Notification): string | undefined {
  const campusId = n.data?.campusId ?? n.campusId;
  if (n.type === "PROVIDER_APPLICATION" || n.type === "JOIN_REQUEST") {
    return "/curator/providers";
  }
  if (typeof campusId === "string" && campusId) {
    return `/curator/schools/${campusId}`;
  }
  return undefined;
}

/** v2 notification → the curator sheet's (v1-shaped) model. */
export function toCuratorNotification(n: Notification): CuratorNotification {
  const related =
    n.data?.resultId ?? n.data?.providerId ?? n.data?.targetId ?? n.id;
  return {
    id: n.id,
    type: n.type as CuratorNotification["type"],
    title: n.title,
    message: n.body,
    createdAt: n.createdAt,
    relatedEntityId: String(related ?? n.id),
    relatedEntityType: n.data?.resultId ? "PATIENT_RESULT" : n.type,
    action: "",
    notification: n.body,
    emoji: n.type === "NOW_RESULT" || n.type === "URGENT_RESULT" ? "🚨" : "🔔",
    // TODO(v2-curator): campus ids are UUIDs now; the v1 model's number id is unused.
    schoolId: 0,
    read: !!n.readAt,
    link: curatorLinkFor(n) as Route | undefined,
  };
}

export const curatorService = {
  /**
   * Sidebar and Studios hub counts: GET /studio/counts, plus the hosts total
   * (Partners) and the pending Just In total, read as `size=1` pages.
   */
  getSummary: async (): Promise<CuratorSummary> => {
    const [counts, hosts, justIn] = await Promise.all([
      catalogueCurator.studioCounts(),
      networkCurator.hosts({ size: 1 }).catch(() => null),
      joinRequestsCurator
        .list({ status: "PENDING", size: 1 })
        .catch(() => null),
    ]);
    return normalizeCuratorSummary(counts, {
      hostCount: hosts?.total,
      justInCount: justIn?.total,
    });
  },

  // ─── Notifications (v2: GET /me/notifications, any signed-in role) ───────
  getNotifications: async (): Promise<CuratorNotificationListResponse> => {
    const [page, counts] = await Promise.all([
      notificationsApi.list({ size: 50 }),
      notificationsApi.counts(),
    ]);
    return {
      success: true,
      message: "",
      data: {
        items: page.items.map(toCuratorNotification),
        unreadCount: counts.total,
        totalCount: page.total,
      },
    };
  },

  getUnreadNotifications: async () => {
    const page = await notificationsApi.list({ unread: true, size: 50 });
    return {
      notifications: page.items.map(toCuratorNotification),
      unreadCount: page.total,
    };
  },

  // TODO(v2-backend): no v2 endpoint sends a notification; curator
  // notifications are raised by the server (PROVIDER_APPLICATION, JOIN_REQUEST, ...).
  sendNotification: async (data: SendNotificationRequest): Promise<void> => {
    void data;
    throw new Error("Sending notifications isn't available yet.");
  },

  markNotificationsRead: async (
    data: MarkNotificationsReadRequest,
  ): Promise<void> => {
    await Promise.all(
      data.notificationIds.map((id) => notificationsApi.markRead(String(id))),
    );
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await notificationsApi.markAllRead();
  },

  // TODO(v2-backend): no v2 endpoint deletes one notification; the sheet hides it.
  deleteNotification: async (id: string | number): Promise<void> => {
    void id;
  },

  // TODO(v2-backend): no v2 endpoint clears all notifications; the sheet hides it.
  clearAllNotifications: async (): Promise<void> => {},
};
