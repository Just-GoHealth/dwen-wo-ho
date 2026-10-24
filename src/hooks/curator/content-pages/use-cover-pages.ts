"use client";

import { useState, useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CoverPage } from "@/lib/types/entities/curator";
import { School } from "@/lib/types/entities/school";
import { pagesCurator, type CoverView } from "@/lib/v2/curator/pages";
import { toastCuratorError } from "@/lib/v2/curator/errors";

type CoverPageInput = { photo: File | null; color: string; slogan: string };

/** A campus's cover pages, or JustGo Health's own (global) with no school picked. */
const coverPagesKey = (schoolId: string | null) =>
  ["curator", "cover-pages", schoolId ?? "global"] as const;

// The colour picker works in bare hex ("2b3990"); v2 stores "#2B3990".
const toApiColour = (hex: string) => (hex ? `#${hex.replace(/^#/, "")}` : null);
const fromApiColour = (colour: string | null) =>
  colour ? colour.replace(/^#/, "").toLowerCase() : "";

function toCoverPage(view: CoverView): CoverPage {
  return {
    id: view.id,
    photo: view.photo?.url ?? "",
    photoPreview: view.photo?.url ?? "",
    color: fromApiColour(view.colour),
    slogan: view.slogan ?? "",
    schoolId: view.campusId,
  };
}

export function useCuratorCoverPages(selectedSchool: School | null) {
  const queryClient = useQueryClient();
  const schoolId = selectedSchool ? String(selectedSchool.id) : null;
  const queryKey = coverPagesKey(schoolId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoverPage, setEditingCoverPage] = useState<CoverPage | null>(
    null,
  );

  const { data: covers = [], isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      pagesCurator.covers(schoolId ? { campusId: schoolId } : { global: true }),
  });

  const refetch = useCallback(
    () => queryClient.invalidateQueries({ queryKey }),
    [queryClient, queryKey],
  );

  const closeAddCoverPage = useCallback(() => {
    setShowAddModal(false);
    setEditingCoverPage(null);
  }, []);

  const saveMutation = useMutation({
    mutationFn: async ({
      editing,
      data,
    }: {
      editing: CoverPage | null;
      data: CoverPageInput;
    }) => {
      if (editing) {
        const current = covers.find((c) => c.id === editing.id);
        let saved = await pagesCurator.updateCover(editing.id, {
          // 409 STALE when someone else changed it first.
          version: current?.version ?? 0,
          slogan: data.slogan,
          colour: toApiColour(data.color) ?? undefined,
        });
        if (data.photo) {
          saved = await pagesCurator.uploadCoverPhoto(saved.id, data.photo);
        }
        return saved;
      }
      const created = await pagesCurator.createCover({
        campusId: schoolId,
        slogan: data.slogan || null,
        colour: toApiColour(data.color),
      });
      return data.photo
        ? pagesCurator.uploadCoverPhoto(created.id, data.photo)
        : created;
    },
    onSuccess: (_saved, { editing }) => {
      void refetch();
      closeAddCoverPage();
      toast.success(editing ? "Cover page updated" : "Cover page added");
    },
    onError: (error) =>
      toastCuratorError(error, {
        fallback: "Failed to save the cover page",
        onStale: () => {
          void refetch();
          closeAddCoverPage();
        },
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pagesCurator.deleteCover(id),
    onSuccess: () => {
      void refetch();
      closeAddCoverPage();
      toast.success("Cover page removed");
    },
    onError: (error) =>
      toastCuratorError(error, { fallback: "Failed to remove the cover page" }),
  });

  const handleCoverPageComplete = useCallback(
    (data: CoverPageInput) => {
      saveMutation.mutate({ editing: editingCoverPage, data });
    },
    [editingCoverPage, saveMutation],
  );

  const handleCoverPageClick = useCallback((coverPage: CoverPage) => {
    setEditingCoverPage(coverPage);
    setShowAddModal(true);
  }, []);

  const openAddCoverPage = useCallback(() => {
    setEditingCoverPage(null);
    setShowAddModal(true);
  }, []);

  const coverPages = useMemo(
    () => covers.toSorted((a, b) => a.position - b.position).map(toCoverPage),
    [covers],
  );

  return {
    coverPages,
    isLoadingCoverPages: isLoading,
    isSavingCoverPage: saveMutation.isPending,
    showAddModal,
    setShowAddModal,
    editingCoverPage,
    setEditingCoverPage,
    handleCoverPageComplete,
    handleCoverPageClick,
    deleteCoverPage: deleteMutation.mutate,
    openAddCoverPage,
    closeAddCoverPage,
  };
}
