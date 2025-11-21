/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import PendingVerificationModal from "@/components/modals/pending-verification";
import PhotoStep from "./steps/photo-step";
import BioStep from "./steps/bio-step";
import SpecialtyStep from "./steps/specialty-step";
import Stepper from "@/components/stepper";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SignUpProfileProps {
  email: string;
  fullName: string;
  title: string;
  onBack?: () => void;
  startStep?: number;
}

const profileSteps = ["Photo", "Bio", "Specialty"];

const SignUpProfile = ({
  email,
  fullName,
  title,
  onBack,
  startStep = 0,
}: SignUpProfileProps) => {
  const [currentStep, setCurrentStep] = useState(startStep);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addSpecialtyMutation, updateProfileMutation } = useAuthQuery();

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

  const handleNext = async () => {
    // Validation
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

    // Next button handles bio and profile submission
    // Handle Bio step submission
    if (currentStep === 1) {
      setIsSubmitting(true);
      try {
        await updateProfileMutation.mutateAsync({
          officePhoneNumber: profileData.phoneNumber,
          status: profileData.bio,
        });

        toast.success("Profile updated successfully!");
        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        console.error("Profile update error:", error);
        toast.error(
          error?.message || "Failed to update profile. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Handle Specialty step submission (final step)
    if (currentStep === 2) {
      setIsSubmitting(true);
      try {
        await addSpecialtyMutation.mutateAsync({
          specialty: profileData.specialty,
        });

        toast.success("Specialty added successfully!");

        // Update userInfo with specialty and show pending modal
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
      } catch (error: any) {
        console.error("Specialty submission error:", error);
        toast.error(
          error?.message || "Failed to add specialty. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // if it is an image, move on to the next since we already uploaded image in the photo step
    if (currentStep == 0) setCurrentStep((prev) => prev + 1);

    // Move to next step (for Photo step only)
    setCurrentStep(currentStep + 1);
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
          disabled={isSubmitting}
          className="rounded-full px-3 sm:px-4 lg:px-6 border-2 sm:border-4 bg-purple-600 text-white text-sm sm:text-base lg:text-xl font-bold border-purple-600 uppercase w-full sm:w-auto hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : currentStep === profileSteps.length - 1 ? (
            "Submit"
          ) : (
            "Next"
          )}
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
