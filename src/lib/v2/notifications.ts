import { http } from "./http";
import type {
  Notification,
  NotificationListParams,
  Page,
  UnreadCounts,
  UUID,
} from "./types";

/** Notifications for any signed-in role (4f). Counters are unread only. */
export const notificationsApi = {
  list: (params: NotificationListParams = {}) =>
    http.get<Page<Notification>>("/me/notifications", {
      query: { ...params },
    }),
  counts: () => http.get<UnreadCounts>("/me/notifications/counts"),
  markRead: (id: UUID) => http.post<void>(`/me/notifications/${id}/read`),
  /** Clears everything, or one campus's feed. */
  markAllRead: (campusId?: UUID) =>
    http.post<void>("/me/notifications/read-all", undefined, {
      query: { campusId },
    }),
};
