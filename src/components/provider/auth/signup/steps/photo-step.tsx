"use client";

import { CheckCircle2, Upload } from "lucide-react";
import Image from "next/image";
import { PhotoStepProps } from "@/lib/types/components/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { PhotoCropperOverlay } from "@/components/shared/overlays/photo-cropper";
import { usePhotoStep } from "@/hooks/components/provider/auth/signup/photo-step/use-photo-step";
import { Input } from "@/components/ui/input";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";

const PhotoStep = ({ profilePhoto, onChange }: PhotoStepProps) => {
  const {
    isPhotoModalOpen,
    setIsPhotoModalOpen,
    imageSrc,
    fileInputRef,
    isUploading,
    onCropComplete,
    handlePhotoUpload,
    handleCancel,
    handleAddPhoto,
    handleFileClick,
    handleUploadClick,
  } = usePhotoStep({ onChange });

  return (
    <>
      {/* Main Container */}
      <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto w-full max-w-xl space-y-8 duration-500">
        {/* Photo Upload Section */}
        <div className="space-y-8 text-center">
          {/* Text Section */}
          <div className="space-y-4">
            {profilePhoto ? (
              <>
                <div className="flex items-center justify-center gap-3">
                  <h1 className="text-3xl font-extrabold tracking-tight">
                    {SIGN_UP_TEXTS.photoStep.photoAdded}
                  </h1>
                  <CheckCircle2 className="text-primary animate-in zoom-in spin-in-90 h-8 w-8 duration-300" />
                </div>
                <p className="text-muted-foreground text-lg">
                  {SIGN_UP_TEXTS.photoStep.photoAddedDescription}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
                  {SIGN_UP_TEXTS.photoStep.addPhoto}
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg">
                  {SIGN_UP_TEXTS.photoStep.photoDescription}
                </p>
              </>
            )}
          </div>

          {/* Photo Circle */}
          <div className="flex justify-center py-4">
            {profilePhoto ? (
              <div
                role="button"
                tabIndex={0}
                aria-label="Change profile photo"
                onClick={handleFileClick}
                onKeyDown={activateOnKeyboard(handleFileClick)}
                className="group relative cursor-pointer"
              >
                <div className="border-background ring-muted group-hover:ring-primary/50 relative h-40 w-40 overflow-hidden rounded-full border-4 shadow-xl ring-4 transition-all duration-300 group-hover:scale-105 sm:h-52 sm:w-52">
                  <Image
                    width={208}
                    height={208}
                    src={profilePhoto}
                    alt="Profile preview"
                    className="relative z-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="font-medium text-white">Change Photo</span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload profile photo"
                onClick={handleUploadClick}
                onKeyDown={activateOnKeyboard(handleUploadClick)}
                className="border-muted-foreground/30 hover:border-primary hover:bg-muted/30 bg-muted/10 group flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed transition-all duration-300 sm:h-52 sm:w-52"
              >
                <div className="bg-background mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-sm transition-transform duration-200 group-hover:scale-110">
                  <Upload className="text-muted-foreground group-hover:text-primary h-8 w-8 transition-colors" />
                </div>
                <span className="text-muted-foreground group-hover:text-primary font-medium transition-colors">
                  {SIGN_UP_TEXTS.photoStep.addPhoto}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <PhotoCropperOverlay
        isOpen={isPhotoModalOpen}
        imageSrc={imageSrc}
        onClose={() => setIsPhotoModalOpen(false)}
        onCropComplete={onCropComplete}
        onSave={handleAddPhoto}
        onCancel={handleCancel}
        isSaving={isUploading}
      />
    </>
  );
};

export default PhotoStep;
