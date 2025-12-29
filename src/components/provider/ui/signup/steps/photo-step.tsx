
"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { CheckCircle2, Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { toast } from "sonner";

interface PhotoStepProps {
  profilePhoto: string | null;
  onChange: (field: "photo", value: string | null) => void;
}

const PhotoStep = ({ profilePhoto, onChange }: PhotoStepProps) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addPhotoMutation } = useAuthQuery();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the actual file for upload
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target?.result as string;
        onChange("photo", photoData);
        setZoomLevel(1);
        setImagePosition({ x: 0, y: 0 });
        setIsPhotoModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZoomLevel(parseFloat(event.target.value));
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: event.clientX - imagePosition.x,
      y: event.clientY - imagePosition.y,
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging) {
      setImagePosition({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetImageTransform = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleAddPhoto = async () => {
    if (!selectedFile) {
      setIsPhotoModalOpen(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      await addPhotoMutation.mutateAsync(formData);

      toast.success("Photo uploaded successfully!");
      setIsPhotoModalOpen(false);
    } catch (error) {
      console.error("Photo upload error:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(
        (error as any)?.message || "Failed to upload photo. Please try again."
      );
    }
  };

  return (
    <div className="text-center space-y-8">
      <h1 className="text-5xl font-extrabold">Add Photo</h1>
      <p className="text-xl text-gray-600">
        Upload your photo so your patients can easily trust and connect with
        you.
      </p>

      <div className="flex justify-center">
        {profilePhoto ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Image
                width={192}
                height={192}
                src={profilePhoto}
                alt="Profile preview"
                className="w-48 h-48 rounded-full object-cover border-4 border-gray-300 cursor-pointer"
                onClick={() => setIsPhotoModalOpen(true)}
              />
            </div>

            {/* Photo Added Confirmation */}
            <div className="flex items-center justify-center space-x-2">
              <h2 className="text-6xl font-bold text-black">Photo Added</h2>
              <div className="w-6 h-6 rounded-full flex items-center justify-center">
                <CheckCircle2 size={36} className="w-36 h-36 text-black" />
              </div>
            </div>

            <p className="text-gray-500 text-2xl">
              You can click on the photo to edit or upload a new one.
            </p>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-48 h-48 rounded-full border-4 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-gray-500 font-medium">PHOTO</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Enhanced Photo Edit Modal */}
      <AnimatePresence>
        {isPhotoModalOpen && profilePhoto && (
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
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Edit Photo
                    </h3>
                    <p className="text-gray-600 text-sm">
                      You can scale, rotate, or drag your image to your desired
                      position. When you are done, click ADD.
                    </p>
                  </div>

                  {/* Photo Editor */}
                  <div className="relative">
                    <div className="relative w-64 h-64 mx-auto border-4 border-gray-300 rounded-full overflow-hidden bg-gray-100">
                      {/* Circular overlay frame */}
                      <div className="absolute inset-0 border-4 border-[#955aa4] rounded-full pointer-events-none z-10" />

                      {/* Editable image */}
                      <div
                        className="absolute inset-0 cursor-move"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{
                          transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoomLevel})`,
                          transformOrigin: "center center",
                        }}
                      >
                        <Image
                          width={256}
                          height={256}
                          src={profilePhoto}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={zoomLevel}
                        onChange={handleZoomChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={resetImageTransform}
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
                  <div className="flex justify-end space-x-4">
                    <Button
                      onClick={() => {
                        onChange("photo", null);
                        setIsPhotoModalOpen(false);
                        setSelectedFile(null);
                        resetImageTransform();
                      }}
                      variant="outline"
                      className="px-6 py-2 border-2 border-[#955aa4] text-[#955aa4] hover:bg-[#955aa4] hover:text-white"
                      disabled={addPhotoMutation.isPending}
                    >
                      CANCEL
                    </Button>
                    <Button
                      onClick={handleAddPhoto}
                      className="px-6 py-2 bg-[#955aa4] hover:bg-[#955aa4]/90 text-white disabled:opacity-50"
                      disabled={addPhotoMutation.isPending}
                    >
                      {addPhotoMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "ADD"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoStep;
