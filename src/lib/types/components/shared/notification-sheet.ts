import type { Atom } from "jotai";

export type NotificationFilterType = "all" | "unread" | "read";

export type NotificationItemAction = "mark-read" | "delete";

// The isLoading/isMarkingRead/isDeleting/isMarkingAllRead/isClearing booleans
// are independent, concurrent async states (e.g. clearing while a single delete
// is in flight), not a single mutually-exclusive status. They are intentionally
// kept as separate flags rather than collapsed into one variant union.
export interface NotificationsSheetProps<N> {
  notifications: N[];
  getNotificationActionUrl: (n: N) => string;
  openAtom: Atom<boolean>;
  onOpenChange: (open: boolean) => void;
  markAllRead: () => void;
  markOneRead: (id: string | number) => void;
  deleteOne?: (id: string | number) => void;
  /** Omit to hide "Clear all" (v2 has no clear-all endpoint). */
  clearAllNotifications?: () => void;
  onNavigate?: (link: string) => void;
  isLoading?: boolean;
  isMarkingRead?: boolean;
  isDeleting?: boolean;
  isMarkingAllRead?: boolean;
  isClearing?: boolean;
  getNotificationId: (n: N) => string | number | undefined;
  isNotificationUnread: (n: N) => boolean;
  getAvatarUrl: (n: N) => string | null | undefined;
  getEmoji: (n: N) => string | undefined;
  getTitle: (n: N) => string | undefined;
  getText: (n: N) => string | undefined;
  getTimestamp: (n: N) => string | undefined;
}

export interface NotificationFilterTabProps {
  active: boolean;
  onClick: () => void;
  count: number;
  label: string;
  showBadge?: boolean;
}

export interface NotificationFilterTabsProps {
  filter: NotificationFilterType;
  onFilterChange: (filter: NotificationFilterType) => void;
  totalCount: number;
  unreadCount: number;
  readCount: number;
  unreadCountForActions: number;
  hasNotifications: boolean;
  markAllRead: () => void;
  /** Omit to hide "Clear all" (v2 has no clear-all endpoint). */
  clearAllNotifications?: () => void;
  isMarkingAllRead: boolean;
  isClearing: boolean;
}

export interface NotificationSheetListProps<N> {
  notifications: N[];
  filter: NotificationFilterType;
  isLoading: boolean;
  getNotificationId: (n: N) => string | number | undefined;
  isNotificationUnread: (n: N) => boolean;
  getNotificationActionUrl: (n: N) => string;
  getItemStatus: (
    notifId: string | number | undefined,
  ) => "idle" | "marking-read" | "deleting";
  onMarkRead: (notifId: string | number) => void;
  onDelete?: (notifId: string | number) => void;
  onNavigate?: (link: string) => void;
  markOneRead: (id: string | number) => void;
  getAvatarUrl: (n: N) => string | null | undefined;
  getEmoji: (n: N) => string | undefined;
  getTitle: (n: N) => string | undefined;
  getText: (n: N) => string | undefined;
  getTimestamp: (n: N) => string | undefined;
}
