"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { toast } from "sonner";
import { useUploadProviderPhoto } from "@/hooks/queries/use-provider-me";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { getCroppedImg } from "@/lib/utils/shared/crop-image";
import { describeApiError } from "@/lib/utils/shared/api-error";
import { routeForProviderNext } from "@/lib/utils/auth/provider-next-route";
import type { Area } from "@/lib/types/components/shared/geometry";

/** Backend limit for the multipart `file` (JPEG, PNG or WEBP). */
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

/**
 * Crop round, then `PUT /providers/me/photo` straight away. If the photo was
 * the last missing field the application is submitted, so route by `next`.
 */
export const usePhotoStep = ({
  onChange,
}: {
  onChange: (field: "photo", value: string | null) => void;
}) => {
  const router = useRouter();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadProviderPhoto();

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      toast.error("Use a JPEG, PNG or WEBP photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      setIsPhotoModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setIsPhotoModalOpen(false);
    setImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddPhoto = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      setIsPhotoModalOpen(false);
      return;
    }

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels).catch(
      () => null,
    );
    if (!croppedBlob) {
      toast.error(SIGN_UP_TEXTS.photoStep.failedProcess);
      return;
    }
    if (croppedBlob.size > MAX_PHOTO_BYTES) {
      toast.error("That photo is over 5 MB. Try a smaller one.");
      return;
    }

    try {
      const profile = await uploadMutation.mutateAsync(croppedBlob);
      onChange("photo", URL.createObjectURL(croppedBlob));
      toast.success(SIGN_UP_TEXTS.photoStep.successUpload);
      setIsPhotoModalOpen(false);
      if (profile.next !== "PROFILE_SETUP") {
        router.replace(routeForProviderNext(profile.next) as Route);
      }
    } catch (error) {
      toast.error(describeApiError(error).message);
    }
  };

  const handleFileClick = () => {
    if (imageSrc) setIsPhotoModalOpen(true);
    else fileInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return {
    isPhotoModalOpen,
    setIsPhotoModalOpen,
    imageSrc,
    fileInputRef,
    isUploading: uploadMutation.isPending,
    onCropComplete,
    handlePhotoUpload,
    handleCancel,
    handleAddPhoto,
    handleFileClick,
    handleUploadClick,
  };
};
