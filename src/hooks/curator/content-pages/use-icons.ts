"use client";

import { useState, useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SchoolIcon, School } from "@/lib/types/entities/school";
import { pagesCurator, type CuratorIcon } from "@/lib/v2/curator/pages";
import { toastCuratorError } from "@/lib/v2/curator/errors";

type IconInput = {
  photo: File | null;
  name: string;
  slogan: string;
  rank: number;
  lockIns: string[];
};

/** The whole icons wall (GET /icons); each icon carries its campusId. */
const ICONS_KEY = ["curator", "icons"] as const;

function toSchoolIcon({ icon }: CuratorIcon): SchoolIcon {
  return {
    id: icon.id,
    photo: icon.photo?.url ?? "",
    photoPreview: icon.photo?.url ?? "",
    name: icon.name,
    slogan: icon.slogan ?? "",
    rank: icon.rank ?? icon.position + 1,
    schoolId: icon.campusId,
    lockIns: icon.lockIns,
  };
}

export function useCuratorIcons(selectedSchool: School | null) {
  const queryClient = useQueryClient();
  const schoolId = selectedSchool ? String(selectedSchool.id) : null;
  const [showAddIconWizard, setShowAddIconWizard] = useState(false);
  const [editingIcon, setEditingIcon] = useState<SchoolIcon | null>(null);

  const { data: wall = [], isLoading } = useQuery({
    queryKey: ICONS_KEY,
    queryFn: pagesCurator.icons,
  });

  const refetch = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ICONS_KEY }),
    [queryClient],
  );

  const closeAddIcon = useCallback(() => {
    setShowAddIconWizard(false);
    setEditingIcon(null);
  }, []);

  const saveMutation = useMutation({
    mutationFn: async ({
      editing,
      data,
    }: {
      editing: SchoolIcon | null;
      data: IconInput;
    }) => {
      const fields = {
        name: data.name,
        slogan: data.slogan,
        rank: data.rank,
        // Sent lists replace what was there, in order.
        lockIns: data.lockIns,
      };
      if (editing) {
        const current = wall.find((w) => w.icon.id === editing.id);
        let saved = await pagesCurator.updateIcon(editing.id, {
          // 409 STALE when someone else changed it first.
          version: current?.version ?? 0,
          ...fields,
        });
        if (data.photo) {
          saved = await pagesCurator.uploadIconPhoto(saved.icon.id, data.photo);
        }
        return saved;
      }
      const created = await pagesCurator.createIcon({
        ...fields,
        campusId: schoolId,
      });
      return data.photo
        ? pagesCurator.uploadIconPhoto(created.icon.id, data.photo)
        : created;
    },
    onSuccess: (_saved, { editing }) => {
      void refetch();
      closeAddIcon();
      toast.success(editing ? "Icon updated" : "Icon added");
    },
    onError: (error) =>
      toastCuratorError(error, {
        fallback: "Failed to save the icon",
        onStale: () => {
          void refetch();
          closeAddIcon();
        },
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pagesCurator.deleteIcon(id),
    onSuccess: () => {
      void refetch();
      closeAddIcon();
      toast.success("Icon removed");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to remove the icon" }),
  });

  const handleIconComplete = useCallback(
    (data: IconInput) => {
      saveMutation.mutate({ editing: editingIcon, data });
    },
    [editingIcon, saveMutation],
  );

  const handleIconClick = useCallback((icon: SchoolIcon) => {
    setEditingIcon(icon);
    setShowAddIconWizard(true);
  }, []);

  const openAddIcon = useCallback(() => {
    setEditingIcon(null);
    setShowAddIconWizard(true);
  }, []);

  // A school's icons, or JustGo Health's own (no campus) with none picked.
  const icons = useMemo(
    () =>
      wall
        .filter((w) => (w.icon.campusId ?? null) === schoolId)
        .map(toSchoolIcon),
    [wall, schoolId],
  );

  return {
    icons,
    isLoadingIcons: isLoading,
    isSavingIcon: saveMutation.isPending,
    showAddIconWizard,
    setShowAddIconWizard,
    editingIcon,
    setEditingIcon,
    handleIconComplete,
    handleIconClick,
    deleteIcon: deleteMutation.mutate,
    openAddIcon,
    closeAddIcon,
  };
}
