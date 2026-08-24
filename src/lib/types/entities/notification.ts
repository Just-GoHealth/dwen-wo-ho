import { PROVIDER_NOTIFICATION_ACTIONS } from "@/lib/constants/infra/app";
import { Route } from "next";

export type CuratorNotificationType =
  | "PROVIDER_REGISTRATION"
  | "PROVIDER_APPLICATION_UPDATE"
  | "SCHOOL_REGISTRATION"
  | "PATIENT_LOCK_IN"
  | "CRITICAL_ALERT"
  | "ADMIN_ACTION_REQUIRED"
  | "PROVIDER_SCHOOL_CHANGE"
  | "NEW_PATIENT_ADDED"
  | "OPEN_PATIENTS_AVAILABLE"
  | "PATIENT_REFERRED"
  | "ACTION_STATUS_CHANGED"
  | "STAR_PROVIDER_ASSIGNED";

export type ProviderNotificationCategory =
  | "NEW_PATIENT_ADDED"
  | "STAR_PROVIDER_ASSIGNED";

export type ProviderNotificationAction =
  (typeof PROVIDER_NOTIFICATION_ACTIONS)[keyof typeof PROVIDER_NOTIFICATION_ACTIONS];

export interface ProviderNotification {
  notificationId: string;
  targetId: number | null;
  targetType: string;
  unread: boolean;
  targetName: string;
  targetSchoolId: number | null;
  targetSchoolName: string | null;
  text: string;
  category: ProviderNotificationCategory;
  action: ProviderNotificationAction;
  notification: string;
  emoji: string;
  timestamp: string;
  avatarUrl: string | null;
  link?: Route;
}

export interface CuratorNotification {
  id: string;
  type: CuratorNotificationType;
  title: string;
  message: string;
  createdAt: string;
  relatedEntityId: string;
  relatedEntityType: string;
  action: string;
  notification: string;
  emoji: string;
  schoolId: number;
  read: boolean;
  targetEmail?: string;
  link?: Route;
}

export interface ProviderNotificationListResponse {
  items: ProviderNotification[];
  unreadCount: number;
  totalCount: number;
}

export interface CuratorNotificationListResponse {
  success: boolean;
  message: string;
  data: {
    items: CuratorNotification[];
    unreadCount: number;
    totalCount?: number;
  };
}
