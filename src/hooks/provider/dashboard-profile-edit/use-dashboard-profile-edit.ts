"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";
import {
  editOpenAtom,
  editFieldKeyAtom,
  editFieldLabelAtom,
  editValueAtom,
} from "@/atoms/new-provider";
import {
  usePatchProviderMe,
  useProviderMe,
  useRoleCategories,
  useUploadProviderPhoto,
} from "@/hooks/queries/use-provider-me";
import { toProviderProfileData } from "@/lib/types/api/provider-dashboard";
import type { ProviderProfileData } from "@/lib/types/api/provider-dashboard";
import { toE164Phone } from "@/lib/utils/provider/profile-patch";
import { describeApiError } from "@/lib/utils/shared/api-error";
import type { ProviderPatchRequest, RoleCategory } from "@/lib/v2/types";

/** Maps one edited field onto `PATCH /providers/me` (omitted = unchanged). */
export function toProfilePatch(
  key: string,
  value: string,
  categories: RoleCategory[],
  currentRoleIds: string[],
): Omit<ProviderPatchRequest, "version"> | null {
  const trimmed = value.trim();
  switch (key) {
    case "title":
      return trimmed ? { title: trimmed } : null;
    case "name":
      return trimmed ? { fullName: trimmed } : null;
    case "status":
      return { slogan: trimmed };
    case "phone":
      return { phone: trimmed ? toE164Phone(trimmed) : "" };
    case "specialty": {
      const category = categories.find((c) => c.name === trimmed);
      if (!category) return null;
      // Whole ordered list; the first one is the default role group.
      return {
        roleCategoryIds: [
          category.id,
          ...currentRoleIds.filter((id) => id !== category.id),
        ],
      };
    }
    default:
      return null;
  }
}

/**
 * Field-by-field profile editing for the profile dialog. Each save is a
 * `PATCH /providers/me` with the cached `version`; a 409 STALE reloads the
 * profile and tells the user (see usePatchProviderMe).
 */
export function useProviderDashboardProfileEdit() {
  const { data: profile } = useProviderMe();
  const { data: categories = [] } = useRoleCategories();
  const [editOpen, setEditOpen] = useAtom(editOpenAtom);
  const [editFieldKey, setEditFieldKey] = useAtom(editFieldKeyAtom);
  const [editFieldLabel, setEditFieldLabel] = useAtom(editFieldLabelAtom);
  const [editValue, setEditValue] = useAtom(editValueAtom);

  const patchMutation = usePatchProviderMe();
  const uploadMutation = useUploadProviderPhoto();

  const profileData: Partial<ProviderProfileData> = profile
    ? toProviderProfileData(profile)
    : {};

  const openEdit = useCallback(
    (key: string, label: string, current: string) => {
      setEditFieldKey(key);
      setEditFieldLabel(label);
      setEditValue(current);
      setEditOpen(true);
    },
    [setEditFieldKey, setEditFieldLabel, setEditValue, setEditOpen],
  );

  const saveEdit = useCallback(async () => {
    if (!editFieldKey || editFieldKey === "photo") {
      setEditOpen(false);
      return;
    }
    const changes = toProfilePatch(
      editFieldKey,
      editValue,
      categories,
      profile?.roleGroups.map((g) => g.id) ?? [],
    );
    if (!changes) {
      setEditOpen(false);
      return;
    }
    try {
      const outcome = await patchMutation.mutateAsync(changes);
      if (outcome.kind === "saved") toast.success("Profile updated");
      setEditOpen(false);
    } catch (error) {
      const described = describeApiError(error);
      toast.error(described.fieldError(editFieldKey) ?? described.message);
    }
  }, [
    categories,
    editFieldKey,
    editValue,
    patchMutation,
    profile?.roleGroups,
    setEditOpen,
  ]);

  const uploadAvatar = useCallback(
    async (file: File) => {
      try {
        const updated = await uploadMutation.mutateAsync(file);
        toast.success("Photo updated");
        return { avatarUrl: updated.photo?.url ?? "" };
      } catch (error) {
        toast.error(describeApiError(error).message);
        throw error;
      }
    },
    [uploadMutation],
  );

  return {
    profile,
    profileData,
    editOpen,
    setEditOpen,
    editFieldKey,
    setEditFieldKey,
    editFieldLabel,
    setEditFieldLabel,
    editValue,
    setEditValue,
    openEdit,
    saveEdit,
    uploadAvatar,
    isUploadingAvatar: uploadMutation.isPending,
    specialtyItems: categories.map((c) => c.name),
    isSaving: patchMutation.isPending,
  };
}
