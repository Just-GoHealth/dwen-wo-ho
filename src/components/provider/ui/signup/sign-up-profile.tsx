/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import {
  Camera,
  Check,
  CheckCircle,
  CheckCircle2,
  Upload,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PendingVerificationModal from "@/components/modals/pending-verification";
import Image from "next/image";

interface SignUpProfileProps {
  email: string;
  fullName: string;
  title: string;
}

const profileSteps = ["Photo", "Bio", "Specialty"] as const;

const SignUpProfile = ({ email, fullName, title }: SignUpProfileProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: `${title} ${fullName}`,
    title: title,
    timeAgo: "Just now",
  });

  // Photo editing states
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const specialties = [
    "Clinical Psychologist",
    "Psychiatrist",
    "Academic Advisor",
    "Counsellor",
    "Mental Health Nurse",
    "Therapist",
    "Medical Doctor",
    "Peer Counselor",
    "Wellness Coach",
    "Career Counselor",
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string);
        setZoomLevel(1);
        setImagePosition({ x: 0, y: 0 });
        setIsPhotoModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Photo editing functions
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

  const handleSpecialtySelect = (specialty: string) => {
    setSelectedSpecialty(specialty);
  };

  const handleNext = () => {
    if (currentStep === 0 && !profilePhoto) {
      alert("Please upload a profile photo");
      return;
    }
    if (currentStep === 1 && (!bio.trim() || !phoneNumber.trim())) {
      alert("Please fill in all required fields");
      return;
    }
    if (currentStep === 2 && !selectedSpecialty) {
      alert("Please select a specialty");
      return;
    }

    if (currentStep < profileSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete profile setup - show pending modal instead of going to profile
      console.log("Profile setup complete");
      setShowPendingModal(true);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Photo
        return (
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-extrabold">Add Photo</h1>
            <p className="text-xl text-gray-600">
              Upload your photo so your patients can easily trust and connect
              with you.
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
                    <h2 className="text-6xl font-bold text-black">
                      Photo Added
                    </h2>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      <CheckCircle2
                        size={36}
                        className="w-36 h-36 text-black"
                      />
                    </div>
                  </div>

                  <p className="text-gray-500 text-2xl">
                    You can click on the photo to remove and upload a new one.
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
          </div>
        );

      case 1: // Bio
        return (
          <div className="space-y-8">
            <h1 className="text-5xl font-extrabold text-center">Add Bio</h1>

            <div className="space-y-6">
              <div>
                <label className="text-xl font-semibold text-gray-700 mb-2 block">
                  Office Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your office phone number"
                  maxLength={10}
                  className="w-full p-4 border-4 border-gray-300 rounded-xl text-xl bg-gray-100 focus:border-[#955aa4] focus:outline-none"
                />
                <p className="text-sm text-gray-500 mt-2">
                  This is private and will not be shared with anyone outside
                  JustGo Health.
                </p>
              </div>

              <div>
                <label className="text-xl font-semibold text-gray-700 mb-2 block">
                  Status
                </label>
                <div className="relative">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Introduce yourself to the world of mental health."
                    maxLength={140}
                    className="w-full p-4 border-4 border-green-600 rounded-xl text-xl bg-gray-100 focus:border-[#955aa4] focus:outline-none resize-none h-32"
                  />
                  <span className="absolute top-2 right-2 text-sm text-gray-500">
                    {bio.length}/140
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Specialty
        return (
          <div className="space-y-8">
            <h1 className="text-5xl font-extrabold text-center">
              Add Specialty
            </h1>
            <p className="text-xl text-gray-600 text-center">
              Click to choose your specialty. You can add more than one later.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => handleSpecialtySelect(specialty)}
                  disabled={
                    !!selectedSpecialty && selectedSpecialty !== specialty
                  }
                  className={`p-4 rounded-full border-2 text-left transition-all duration-200 ${
                    selectedSpecialty === specialty
                      ? "border-[#ed1c24] bg-red-50 text-[#ed1c24]"
                      : selectedSpecialty && selectedSpecialty !== specialty
                      ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 bg-gray-100 hover:border-gray-400"
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex-1 flex items-center justify-center px-12">
        {renderStepContent()}
      </div>

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
                      position. When you are done, click submit.
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
                        className="w-full h-2 bg-gray-200 rounded-lg border-6 border-[#adad7e] appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Rotate Button */}
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
                        setProfilePhoto(null);
                        setIsPhotoModalOpen(false);
                        resetImageTransform();
                      }}
                      variant="outline"
                      className="px-6 py-2 border-2 border-[#955aa4] text-[#955aa4] hover:bg-[#955aa4] hover:text-white"
                    >
                      CANCEL
                    </Button>
                    <Button
                      onClick={() => setIsPhotoModalOpen(false)}
                      className="px-6 py-2 bg-[#955aa4] hover:bg-[#955aa4]/90 text-white"
                    >
                      ADD
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pending Verification Modal */}
      <PendingVerificationModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        userInfo={userInfo}
      />
    </div>
  );
};

export default SignUpProfile;
