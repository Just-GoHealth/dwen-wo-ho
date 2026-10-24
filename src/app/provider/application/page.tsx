"use client";

import { useAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import { PendingApprovalModal } from "@/components/provider/pending-approval-modal";
import ProviderProfileDialog from "@/components/provider/profile-dialog";
import EditFieldDialog from "@/components/provider/workspace/edit-field-dialog";
import { usePendingApproval } from "@/hooks/provider/pending-approval/use-pending-approval";
import { useProviderDashboardProfileEdit } from "@/hooks/provider/dashboard-profile-edit/use-dashboard-profile-edit";
import { profileOpenAtom } from "@/atoms/new-provider";
import { toPendingApprovalUserInfo } from "@/lib/utils/provider/pending-approval";
import { performLogout } from "@/lib/auth/session";
import { ROUTES } from "@/lib/constants/infra/routes";
import { NEW_PROVIDER_EDITABLE_FIELDS } from "@/lib/constants/components/provider/workspace/dashboard";

// PROFILE_INCOMPLETE names a v2 field; the profile dialog uses its own keys.
const FIELD_TO_EDIT_KEY: Record<string, string> = {
  title: "title",
  fullName: "name",
  phone: "phone",
  roleCategoryIds: "specialty",
  photo: "photo",
};

/**
 * The application page for `next: PENDING | REJECTED`. Live via the SSE
 * `provider-status` event, polling `GET /providers/me` as the fallback; a
 * rejected provider can edit their profile and resubmit from here.
 */
export default function ProviderApplicationPage() {
  const queryClient = useQueryClient();
  const { profile, isLoading, status, resubmit, isResubmitting } =
    usePendingApproval();
  const [profileOpen, setProfileOpen] = useAtom(profileOpenAtom);
  const edit = useProviderDashboardProfileEdit();

  if (isLoading || !profile) {
    return (
      <div className="bg-app-gradient flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  const openFieldFor = (field: string | null) => {
    const key = field ? FIELD_TO_EDIT_KEY[field] : undefined;
    if (!key) {
      setProfileOpen(true);
      return;
    }
    const label =
      key === "photo"
        ? "Profile Photo"
        : (NEW_PROVIDER_EDITABLE_FIELDS.find((f) => f.key === key)?.label ??
          key);
    const current =
      key === "photo"
        ? ""
        : String(
            (edit.profileData as Record<string, string | null>)[key] ?? "",
          );
    edit.openEdit(key, label, current);
  };

  return (
    <div className="bg-app-gradient min-h-dvh">
      <PendingApprovalModal
        userInfo={toPendingApprovalUserInfo(profile)}
        status={status}
        onLogout={() => void performLogout(queryClient, ROUTES.provider.auth)}
        onEdit={status === "REJECTED" ? () => setProfileOpen(true) : undefined}
        onResubmit={
          status === "REJECTED" ? () => void resubmit(openFieldFor) : undefined
        }
        isResubmitting={isResubmitting}
      />
      <ProviderProfileDialog
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        profileData={edit.profileData}
        openEdit={edit.openEdit}
        schools={[]}
      />
      <EditFieldDialog
        editOpen={edit.editOpen}
        setEditOpen={edit.setEditOpen}
        editFieldKey={edit.editFieldKey}
        editFieldLabel={edit.editFieldLabel}
        editValue={edit.editValue}
        setEditValue={edit.setEditValue}
        saveEdit={edit.saveEdit}
        uploadAvatar={edit.uploadAvatar}
        isUploadingAvatar={edit.isUploadingAvatar}
        isSaving={edit.isSaving}
        profileData={edit.profileData}
        specialtyItems={edit.specialtyItems}
      />
    </div>
  );
}
