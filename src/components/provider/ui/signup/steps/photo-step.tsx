"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useCallback } from "react";
import { CheckCircle2, Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { toast } from "sonner";
import Cropper from "react-easy-crop";

// Type definitions for react-easy-crop
type Point = { x: number; y: number };
type Area = { x: number; y: number; width: number; height: number };

interface PhotoStepProps {
  profilePhoto: string | null;
  onChange: (field: "photo", value: string | null) => void;
  onNext: () => void;
  onBack: () => void;
}

const PhotoStep = ({ profilePhoto, onChange, onNext, onBack }: PhotoStepProps) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPhotoMutation } = useAuthQuery();

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target?.result as string;
        setImageSrc(photoData);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setIsPhotoModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const createCroppedImage = async (): Promise<Blob | null> => {
    if (!imageSrc || !croppedAreaPixels) return null;

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleAddPhoto = async () => {
    if (!selectedFile || !croppedAreaPixels) {
      setIsPhotoModalOpen(false);
      return;
    }

    try {
      const croppedBlob = await createCroppedImage();
      if (!croppedBlob) {
        toast.error("Failed to process image");
        return;
      }

      console.log("📸 Cropped Blob Details:", {
        size: croppedBlob.size,
        type: croppedBlob.type,
        dimensions: croppedAreaPixels
      });

      // Convert Blob to File to ensure consistent handling by backend
      const file = new File([croppedBlob], "profile-photo.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("image", file);

      try {
        // Send FormData to API
        await addPhotoMutation.mutateAsync(formData);

        // Create preview URL for display
        const previewUrl = URL.createObjectURL(croppedBlob);
        onChange("photo", previewUrl);

        toast.success("Photo uploaded successfully!");
        setIsPhotoModalOpen(false);
        // Automatically move to next step as per requirements
        onNext();

      } catch (error) {
        console.error("Photo upload error:", error);
        toast.error(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.message || "Failed to upload photo. Please try again."
        );
      }


    } catch (error) {
      console.error("Photo processing error:", error);
      toast.error("Failed to process image");
    }
  };

  return (
    <>
      {/* Main Container - matching create-account.tsx exactly */}
      <div className="w-full max-w-xl mx-auto space-y-4">
        {/* Photo Upload Section */}
        <div className="space-y-6 text-center">

          {/* Photo Circle */}
          <div className="flex justify-center py-6 -mt-15">
            {profilePhoto ? (
              <div
                onClick={() => {
                  if (imageSrc) {
                    setIsPhotoModalOpen(true);
                  }
                }}
                className="cursor-pointer"
              >
                <Image
                  width={200}
                  height={200}
                  src={profilePhoto}
                  alt="Profile preview"
                  className="w-52 h-52 rounded-full object-cover border-4 border-gray-300 mx-auto hover:opacity-90 transition-opacity"
                />
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-52 h-52 rounded-full border-4 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
              >
                <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center mb-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-gray-500 font-bold text-lg">PHOTO</span>
              </div>
            )}
          </div>

          {/* Text below circle */}
          {profilePhoto ? (
            <>
              <div className="flex items-center justify-center gap-3">
                <h1 className="text-3xl font-extrabold text-black">Photo Added</h1>
                <CheckCircle2 size={32} className="text-green-600" />
              </div>

              <p className="text-gray-500 text-base">
                You can click on the photo to edit or upload a new one.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-extrabold text-black">
                Add Photo
              </h1>

              <p className="text-gray-600 text-lg font-bold px-10">
                Upload your photo so your patients can easily trust and connect with you.
              </p>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Bottom Navigation - matching create account page */}
      <div className="flex flex-col sm:flex-row border-t border-gray-500 px-4 sm:px-6 lg:px-6 py-4 items-center justify-between space-y-4 sm:space-y-0 mt-8 fixed bottom-0 right-0 w-full lg:w-1/2 bg-white">
        <Button
          onClick={onBack}
          className="rounded-full mr-2 px-8 py-1 border-4 bg-white text-[#955aa4] text-lg font-bold border-[#955aa4] uppercase flex items-center justify-center hover:bg-white"
        >
          Back
        </Button>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-black" />
              <span className="font-semibold text-black">1. Photo</span>
            </div>
            <span className="text-gray-400">—</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full border-2 border-gray-400" />
              <span className="text-gray-400">2. Bio</span>
            </div>
            <span className="text-gray-400">—</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full border-2 border-gray-400" />
              <span className="text-gray-400">3. Specialty</span>
            </div>
          </div>
        </div>

        <Button
          onClick={onNext}
          disabled={!profilePhoto}
          className="rounded-full ml-2 px-8 py-1 border-4 text-lg font-bold uppercase transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#955aa4]/80 text-white border-[#955aa4] hover:bg-[#955aa4] disabled:hover:bg-[#955aa4]/80"
        >
          Next
        </Button>
      </div>

      {/* Photo Edit Modal */}
      <AnimatePresence>
        {isPhotoModalOpen && imageSrc && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsPhotoModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white shadow-2xl p-8 px-0 max-w-2xl w-full">
                <div className="space-y-6">
                  <div className="text-left px-10">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      Edit Photo
                    </h3>
                    <p className="text-gray-500 text-md font-bold">
                      You can scale, rotate, or drag your image to your desired position.
                      When you are done, click submit.
                    </p>
                  </div>

                  {/* Photo Cropper */}
                  <div className="relative w-full h-96 bg-gray-900 overflow-hidden">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-4 px-35">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#955aa4]"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setCrop({ x: 0, y: 0 });
                        setZoom(1);
                      }}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end px-7 gap-4">
                    <Button
                      onClick={() => {
                        onChange("photo", null);
                        setIsPhotoModalOpen(false);
                        setSelectedFile(null);
                        setImageSrc(null);
                        // Reset file input so same file can be selected again
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      variant="outline"
                      className="px-8 py-1 rounded-full border-4 border-[#955aa4] text-[#955aa4] hover:bg-[#955aa4] hover:text-white uppercase font-bold"
                      disabled={addPhotoMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddPhoto}
                      className="px-8 py-1 border-4 border-[#955aa4] rounded-full bg-[#955aa4]/60 hover:bg-[#955aa4]/90 text-white disabled:opacity-50 uppercase font-bold"
                      disabled={addPhotoMutation.isPending}
                    >
                      {addPhotoMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Helper function to create image element
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

export default PhotoStep;
