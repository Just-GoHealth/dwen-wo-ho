import { curatorService } from "../curator";
import type { SendNotificationRequest } from "@/lib/types/api/curator";

/**
 * TODO(v2-curator): v1 curator notification calls. Providers moved to the
 * v2 notifications API (`@/lib/v2/notifications`, any signed-in role), which
 * the curator surface should adopt too.
 */
export const unifiedNotificationsService = {
  getNotifications: () => curatorService.getNotifications(),

  markNotificationRead: (id: string): Promise<void> =>
    curatorService.markNotificationsRead({ notificationIds: [id] }),

  markAllNotificationsRead: (): Promise<void> =>
    curatorService.markAllNotificationsRead(),

  deleteNotification: (id: string | number): Promise<void> =>
    curatorService.deleteNotification(id),

  clearAllNotifications: (): Promise<void> =>
    curatorService.clearAllNotifications(),

  sendNotification: (data: SendNotificationRequest): Promise<void> =>
    curatorService.sendNotification(data),
};
