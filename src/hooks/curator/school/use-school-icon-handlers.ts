"use client";

import { useCallback } from "react";
import type { SchoolIcon } from "@/lib/types/entities/school";

interface UseSchoolIconHandlersParams {
  addOrUpdateIcon: (
    data: {
      photo: File | null;
      name: string;
      slogan: string;
      rank: number;
      lockIns: string[];
    },
    editingIcon: SchoolIcon | null,
    schoolId: string | null,
    onComplete: () => void,
  ) => void;
  editingIcon: SchoolIcon | null;
  schoolId: string | null;
  setShowAddIconWizard: (open: boolean) => void;
  setEditingIcon: (icon: SchoolIcon | null) => void;
}

export function useSchoolIconHandlers({
  addOrUpdateIcon,
  editingIcon,
  schoolId,
  setShowAddIconWizard,
  setEditingIcon,
}: UseSchoolIconHandlersParams) {
  const handleIconComplete = useCallback(
    (data: {
      photo: File | null;
      name: string;
      slogan: string;
      rank: number;
      lockIns: string[];
    }) => {
      addOrUpdateIcon(data, editingIcon, schoolId, () => {
        setShowAddIconWizard(false);
        setEditingIcon(null);
      });
    },
    [
      addOrUpdateIcon,
      editingIcon,
      schoolId,
      setShowAddIconWizard,
      setEditingIcon,
    ],
  );

  return { handleIconComplete };
}
