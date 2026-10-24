"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SchoolIcon } from "@/lib/types/entities/school";
import { pagesCurator } from "@/lib/v2/curator/pages";
import type { CuratorIcon } from "@/lib/v2/curator/pages";
import { toastCuratorError } from "@/lib/v2/curator/errors";
import { curatorIconToSchoolIcon } from "@/lib/utils/curator/schools/v2-adapters";

interface IconFormData {
  photo: File | null;
  name: string;
  slogan: string;
  rank: number;
  lockIns: string[];
}

// The icons wall is one list (GET /icons); the school screen shows the
// entries whose campusId is this campus.
const ICONS_QUERY_KEY = ["curator-icons"] as const;

async function saveIcon({
  data,
  editingIcon,
  schoolId,
  current,
}: {
  data: IconFormData;
  editingIcon: SchoolIcon | null;
  schoolId: string | null;
  current: CuratorIcon | undefined;
}): Promise<CuratorIcon> {
  const fields = {
    name: data.name,
    slogan: data.slogan,
    rank: data.rank > 0 ? data.rank : null,
    lockIns: data.lockIns,
  };
  let saved =
    editingIcon && current
      ? await pagesCurator.updateIcon(current.icon.id, {
          version: current.version,
          ...fields,
        })
      : await pagesCurator.createIcon({ ...fields, campusId: schoolId });
  if (data.photo) {
    saved = await pagesCurator.uploadIconPhoto(saved.icon.id, data.photo);
  }
  return saved;
}

export function useSchoolIcons() {
  const queryClient = useQueryClient();

  const { data: rawIcons = [] } = useQuery({
    queryKey: ICONS_QUERY_KEY,
    queryFn: pagesCurator.icons,
    staleTime: 60 * 1000,
  });

  const icons = rawIcons.map(curatorIconToSchoolIcon);

  const mutation = useMutation({
    mutationFn: saveIcon,
    onSuccess: (_, { editingIcon }) => {
      toast.success(editingIcon ? "Icon updated" : "Icon added");
      void queryClient.invalidateQueries({ queryKey: ICONS_QUERY_KEY });
    },
    onError: (error) =>
      toastCuratorError(error, {
        fallback: "Failed to save icon",
        // 409 STALE: reload the wall so the next save carries the new version.
        onStale: () =>
          void queryClient.invalidateQueries({ queryKey: ICONS_QUERY_KEY }),
      }),
  });

  const addOrUpdateIcon = useCallback(
    (
      data: IconFormData,
      editingIcon: SchoolIcon | null,
      schoolId: string | null,
      onComplete: () => void,
    ) => {
      const current = editingIcon
        ? rawIcons.find((i) => i.icon.id === editingIcon.id)
        : undefined;
      mutation.mutate(
        { data, editingIcon, schoolId, current },
        { onSuccess: onComplete },
      );
    },
    [mutation, rawIcons],
  );

  return { icons, addOrUpdateIcon, isSavingIcon: mutation.isPending };
}
