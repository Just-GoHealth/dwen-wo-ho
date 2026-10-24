"use client";

import { useRef, useState, KeyboardEvent, ChangeEvent } from "react";
import { m } from "motion/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NEW_PROVIDER_EDITABLE_FIELDS } from "@/lib/constants/components/provider/workspace/dashboard";
import {
  PROVIDER_TITLES,
  PROVIDER_SPECIALTIES,
} from "@/lib/constants/components/provider/profile/profile";
import { Spinner } from "@/components/ui/spinner";
import { EditFieldPhotoField } from "./photo-field";
import { EditFieldTextField } from "./text-field";
import { EditFieldSelectField } from "./select-field";
import { EditFieldStatusField } from "./status-field";
import type { EditFieldDialogProps } from "@/lib/types/components/provider/edit-field";

/**
 * Small edit popup for a single profile field.
 */
export default function EditFieldDialog({
  editOpen,
  setEditOpen,
  editFieldKey,
  editFieldLabel,
  editValue,
  setEditValue,
  saveEdit,
  uploadAvatar,
  isUploadingAvatar,
  isSaving = false,
  profileData,
  specialtyItems,
}: EditFieldDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isPhotoField = editFieldKey === "photo";
  const isSavingChanges = Boolean(isUploadingAvatar || isSaving);
  const isTitleField = editFieldKey === "title";
  const isSpecialtyField = editFieldKey === "specialty";
  const isStatusField = editFieldKey === "status";
  const isSelectField = isTitleField || isSpecialtyField;
  // Specialties are the backend's role categories when we have them.
  const selectItems = isTitleField
    ? PROVIDER_TITLES
    : specialtyItems?.length
      ? specialtyItems
      : PROVIDER_SPECIALTIES;

  const hint = isPhotoField
    ? "Upload a new profile photo"
    : (NEW_PROVIDER_EDITABLE_FIELDS.find((f) => f.key === editFieldKey)?.hint ??
      "");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") setEditOpen(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (isPhotoField && selectedFile && uploadAvatar) {
      if (selectedFile.size > 5 * 1024 * 1024) return;
      try {
        await uploadAvatar(selectedFile);
        setSelectedFile(null);
        setEditOpen(false);
      } catch {
        // The upload hook already showed the error; keep the dialog open.
      }
    } else {
      saveEdit();
    }
  };

  let fieldContent;
  if (isPhotoField) {
    fieldContent = (
      <EditFieldPhotoField
        fileInputRef={fileInputRef}
        selectedFile={selectedFile}
        profileData={profileData}
        onFileChange={handleFileChange}
        onSelectClick={() => fileInputRef.current?.click()}
      />
    );
  } else if (isSelectField && editFieldKey) {
    fieldContent = (
      <EditFieldSelectField
        fieldKey={editFieldKey}
        value={editValue}
        onChange={setEditValue}
        label={editFieldLabel}
        items={selectItems}
      />
    );
  } else if (isStatusField) {
    fieldContent = (
      <EditFieldStatusField
        value={editValue}
        onChange={setEditValue}
        onKeyDown={handleKeyDown}
      />
    );
  } else {
    fieldContent = (
      <EditFieldTextField
        value={editValue}
        onChange={setEditValue}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent
        aria-describedby={undefined}
        className="w-95 gap-0 rounded-3xl border p-0 px-6 pb-4"
      >
        <DialogHeader className="mt-10 mb-4">
          <DialogTitle className="text-[16px] font-bold">
            Edit {editFieldLabel}
          </DialogTitle>
        </DialogHeader>

        {fieldContent}

        {hint ? (
          <p className="text-muted-foreground mb-5 text-[11px]">{hint}</p>
        ) : null}

        <div className="mt-2 flex gap-2">
          <m.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSelectedFile(null);
              setEditOpen(false);
            }}
            className="border-destructive/50 text-destructive hover:bg-destructive! flex-1 cursor-pointer rounded-xl border py-2.5 text-[13px] font-semibold transition-all duration-300 ease-in-out hover:text-white"
            disabled={isSavingChanges}
          >
            Cancel
          </m.button>

          <m.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleUpload}
            disabled={
              isPhotoField ? !selectedFile || isSavingChanges : isSavingChanges
            }
            className="text-primary border-primary/50 hover:bg-primary flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 text-[13px] font-semibold transition-all duration-300 ease-in-out hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingChanges ? (
              <>
                <Spinner className="size-3.5" />
                {isUploadingAvatar ? "Uploading…" : "Saving…"}
              </>
            ) : (
              "Save Changes"
            )}
          </m.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
