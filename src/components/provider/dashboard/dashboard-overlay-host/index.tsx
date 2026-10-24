"use client";

import ProviderProfileDialog from "@/components/provider/profile-dialog";
import EditFieldDialog from "@/components/provider/workspace/edit-field-dialog";
import ProviderNotificationsSheet from "@/components/provider/workspace/notification-sheet/index";
import type { ProviderDashboardOverlayHostProps } from "@/lib/types/components/provider/dashboard/dashboard";
import type { ProviderDashboardState } from "@/hooks/provider/dashboard/use-dashboard";

/**
 * Overlays on the provider home. The pending/rejected application has its
 * own page now (/provider/application), routed by `next`.
 */
export default function ProviderDashboardModals({
  dashboard,
  router,
}: ProviderDashboardOverlayHostProps<ProviderDashboardState>) {
  const {
    notifications,
    setNotifOpen,
    markAllRead,
    markOneRead,
    isMarkingRead,
    isMarkingAllRead,
    profileOpen,
    setProfileOpen,
    profileData,
    openEdit,
    schools,
    editOpen,
    setEditOpen,
    editFieldKey,
    editFieldLabel,
    editValue,
    setEditValue,
    saveEdit,
    uploadAvatar,
    isUploadingAvatar,
    isSaving,
    specialtyItems,
  } = dashboard;

  return (
    <>
      <ProviderNotificationsSheet
        notifications={notifications}
        setNotifOpen={setNotifOpen}
        markAllRead={markAllRead}
        markOneRead={markOneRead}
        router={router}
        isMarkingRead={isMarkingRead}
        isMarkingAllRead={isMarkingAllRead}
      />
      <ProviderProfileDialog
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        profileData={profileData}
        openEdit={openEdit}
        schools={schools}
      />
      <EditFieldDialog
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        editFieldKey={editFieldKey}
        editFieldLabel={editFieldLabel}
        editValue={editValue}
        setEditValue={setEditValue}
        saveEdit={saveEdit}
        uploadAvatar={uploadAvatar}
        isUploadingAvatar={isUploadingAvatar}
        isSaving={isSaving}
        profileData={profileData}
        specialtyItems={specialtyItems}
      />
    </>
  );
}
