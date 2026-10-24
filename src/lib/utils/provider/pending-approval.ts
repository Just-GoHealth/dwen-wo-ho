import { calculateTimeAgo } from "@/lib/utils/shared/time-ago";
import type {
  PendingApprovalProfileInput,
  PendingApprovalUserInfo,
} from "@/lib/types/components/provider/pending-approval-modal";

/** Pending page header from `GET /providers/me`; "time since applying" is `submittedAt`. */
export const toPendingApprovalUserInfo = (
  profile?: PendingApprovalProfileInput,
): PendingApprovalUserInfo => {
  const name = [profile?.title, profile?.fullName].filter(Boolean).join(" ");
  const roleGroup = profile?.roleGroups?.[0]?.name ?? "";

  return {
    name,
    title: roleGroup,
    specialty: roleGroup,
    profileImage: profile?.photo?.thumbnailUrl ?? profile?.photo?.url,
    timeAgo: profile?.submittedAt
      ? calculateTimeAgo(profile.submittedAt)
      : "Recently",
  };
};
