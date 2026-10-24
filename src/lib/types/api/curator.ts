import { CuratorNotificationType } from "../entities/notification";

export interface CuratorSummary {
  /** Campuses (GET /studio/counts `campuses`). */
  schoolCount: number;
  /** Provider records (`providers`). */
  providerCount: number;
  /** Hosts (GET /hosts total); v1 "partners". */
  partnerCount: number;
  campusCount: number;
  /** Studios "Providers" card; same as providerCount on v2. */
  specialtyCount: number;
  programmeCount: number;
  tagCount: number;
  /** Pending join requests and provider applications (Just In). */
  justInCount: number;
}

// v1 only: POST /curator/notifications/send has no v2 endpoint.
export interface SendNotificationRequest {
  type: CuratorNotificationType;
  title: string;
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  actionUrl?: string;
  schoolId?: number;
  sendToAllCurators?: boolean;
  curatorId?: string;
  recipientId?: string;
}

export interface MarkNotificationsReadRequest {
  notificationIds: string[]; // array of UUIDs
}
