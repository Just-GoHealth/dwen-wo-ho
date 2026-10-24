import type { ProviderProfile } from "@/lib/v2/types";

export type PendingApprovalProfileInput = Partial<
  Pick<
    ProviderProfile,
    "title" | "fullName" | "roleGroups" | "photo" | "submittedAt"
  >
>;

export interface PendingApprovalUserInfo {
  name: string;
  title: string;
  specialty: string;
  profileImage?: string;
  timeAgo: string;
}

export interface PendingApprovalModalProps {
  userInfo: PendingApprovalUserInfo;
  onLogout: () => void;
  /** REJECTED shows "not accepted" with Edit and Resubmit. */
  status?: "PENDING" | "REJECTED";
  onEdit?: () => void;
  onResubmit?: () => void;
  isResubmitting?: boolean;
}
