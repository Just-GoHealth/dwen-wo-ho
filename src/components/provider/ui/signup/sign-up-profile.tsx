/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import PendingVerificationModal from "@/components/modals/pending-verification";
import PhotoStep from "./steps/photo-step";
import BioStep from "./steps/bio-step";
import SpecialtyStep from "./steps/specialty-step";
import Stepper from "@/components/stepper";
import { profile } from "node:console";

interface SignUpProfileProps {
  email: string;
  fullName: string;
  title: string;
  onBack?: () => void;
}

const profileSteps = ["Photo", "Bio", "Specialty"];

const SignUpProfile = ({
  email,
  fullName,
  title,
  onBack,
}: SignUpProfileProps) => {
  const [currentStep, setCurrentStep] = useState(2);
  const [showPendingModal, setShowPendingModal] = useState(false);

  // Single state object for all profile data
  const [profileData, setProfileData] = useState({
    photo: null as string | null,
    phoneNumber: "",
    bio: "",
    specialty: "",
  });

  const [userInfo, setUserInfo] = useState({
    name: `${title} ${fullName}`,
    title: title,
    specialty: "",
    timeAgo: "Just now",
  });

  const handleChange = (
    property: keyof typeof profileData,
    value: string | null
  ) => {
    setProfileData((prev) => ({ ...prev, [property]: value }));
  };

  const handleBack = () => {
    if (currentStep === 0) {
      // On first step, go back to parent's verify step
      onBack?.();
    } else {
      // Otherwise, go to previous profile step
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && !profileData.photo) {
      alert("Please upload a profile photo");
      return;
    }
    if (
      currentStep === 1 &&
      (!profileData.bio.trim() || !profileData.phoneNumber.trim())
    ) {
      alert("Please fill in all required fields");
      return;
    }
    if (currentStep === 2 && !profileData.specialty) {
      alert("Please select a specialty");
      return;
    }

    if (currentStep < profileSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete profile setup - update userInfo with specialty and show pending modal
      setUserInfo((prev) => ({
        ...prev,
        specialty: profileData.specialty,
        profileImage: profileData.photo || undefined,
      }));
      console.log("Profile setup complete", {
        email,
        fullName,
        title,
        ...profileData,
      });
      setShowPendingModal(true);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Photo
        return (
          <PhotoStep
            profilePhoto={profileData.photo}
            onChange={(field, value) => handleChange(field, value)}
          />
        );

      case 1: // Bio
        return (
          <BioStep
            phoneNumber={profileData.phoneNumber}
            bio={profileData.bio}
            onChange={(field, value) => handleChange(field, value)}
          />
        );

      case 2: // Specialty
        return (
          <SpecialtyStep
            specialty={profileData.specialty}
            onChange={(field, value) => handleChange(field, value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col ">
      {/* Main Content */}
      <div className="flex-1  flex flex-col justify-center">
        <div className="w-full max-w-4xl mx-auto">{renderStepContent()}</div>
      </div>

      {/* Bottom Navigation - Same design as parent */}
      <div className="flex flex-col sm:flex-row border-t border-gray-500 px-4 sm:px-6 lg:px-10 py-4 sm:pt-6 items-center justify-between space-y-4 sm:space-y-0">
        <Button
          onClick={handleBack}
          className="rounded-full px-3 sm:px-4 lg:px-6 border-2 sm:border-4 bg-white text-[#955aa4] text-sm sm:text-base lg:text-xl font-bold border-[#955aa4] uppercase w-full sm:w-auto"
        >
          Back
        </Button>

        <div className="flex-1 flex justify-center">
          <Stepper steps={profileSteps} step={profileSteps[currentStep]} />
        </div>

        <Button
          onClick={handleNext}
          className="rounded-full px-3 sm:px-4 lg:px-6 border-2 sm:border-4 bg-purple-600 text-white text-sm sm:text-base lg:text-xl font-bold border-purple-600 uppercase w-full sm:w-auto hover:bg-purple-700 transition-colors"
        >
          {currentStep === profileSteps.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>

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
