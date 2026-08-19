"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ProfileHero } from "./profile-hero";
import { ProfileTabs } from "./profile-tabs";
import { ProfileFooter } from "./profile-footer";
import type { ProviderDashboardState } from "@/hooks/provider/dashboard/use-dashboard";
import type { ProviderAssociatedSchool } from "@/lib/types/api/providers";
/**
 * Profile dialog with Overview / Schools / Partners tabs.
 *
 * @param {{
 *   open:         boolean,
 *   onOpenChange: (v: boolean) => void,
 *   profileData:  Record<string, string>,
 *   onEdit:       (key: string, label: string, current: string) => void,
 *   schools:      ProviderAssociatedSchool[]
 * }} props
 */
export default function ProviderProfileDialog({
  profileOpen,
  setProfileOpen,
  profileData,
  openEdit,
  schools,
}: {
  profileOpen: ProviderDashboardState["profileOpen"];
  setProfileOpen: ProviderDashboardState["setProfileOpen"];
  profileData: ProviderDashboardState["profileData"];
  openEdit: ProviderDashboardState["openEdit"];
  schools: ProviderAssociatedSchool[];
}) {
  return (
    <Dialog open={profileOpen} onOpenChange={setProfileOpen} modal>
      <DialogContent
        aria-describedby={undefined}
        style={{ background: "var(--bg)" }}
        className="flex max-h-[88vh] w-[95vw] max-w-3xl flex-col gap-0 overflow-hidden rounded-4xl border p-0 sm:max-w-3xl lg:max-w-4xl"
      >
        <VisuallyHidden.Root>
          <DialogTitle>Provider Profile Details</DialogTitle>
        </VisuallyHidden.Root>
        <ProfileHero profileData={profileData} onEdit={openEdit} />
        <ProfileTabs
          profileData={profileData}
          onEdit={openEdit}
          schools={schools}
        />
        <ProfileFooter />
      </DialogContent>
    </Dialog>
  );
}
