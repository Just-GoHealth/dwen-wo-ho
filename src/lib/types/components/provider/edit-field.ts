import type {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  RefObject,
  SetStateAction,
} from "react";

export interface SearchableSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string | null;
  items: readonly string[];
}

export interface EmojiStatusFieldProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export interface EditFieldDialogProps {
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  editFieldKey: string | null;
  editFieldLabel: string | null;
  editValue: string;
  setEditValue: Dispatch<SetStateAction<string>>;
  saveEdit: () => void | Promise<void>;
  uploadAvatar?: (file: File) => Promise<{ avatarUrl: string }>;
  isUploadingAvatar?: boolean;
  isSaving?: boolean;
  profileData?: { avatarUrl?: string; name?: string };
  /** Role category names for the specialty field. */
  specialtyItems?: readonly string[];
}

export interface EditFieldPhotoFieldProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  selectedFile: File | null;
  profileData?: { avatarUrl?: string; name?: string };
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelectClick: () => void;
}

export interface EditFieldTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export interface EditFieldSelectFieldProps {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
  label: string | null;
  items: readonly string[];
}

export interface EditFieldStatusFieldProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}
