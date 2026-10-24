"use client";

import type { ReactNode } from "react";
import PhotoStep from "../steps/photo-step";
import BioStep from "../steps/bio-step";
import SpecialtyStep from "../steps/specialty-step";
import { SignUpProfileContentProps } from "@/lib/types/components/provider/auth";

const SignUpProfile = ({
  currentStep,
  profileData,
  onFieldChange,
  fieldError,
}: SignUpProfileContentProps) => {
  let stepContent: ReactNode = null;
  switch (currentStep) {
    case 0:
      stepContent = (
        <PhotoStep
          profilePhoto={profileData.photo}
          onChange={(field, value) => onFieldChange(field, value)}
        />
      );
      break;

    case 1:
      stepContent = (
        <BioStep
          phoneNumber={profileData.phoneNumber}
          bio={profileData.bio}
          onChange={(field, value) => onFieldChange(field, value)}
          fieldError={fieldError}
        />
      );
      break;

    case 2:
      stepContent = (
        <SpecialtyStep
          specialty={profileData.specialty}
          onChange={(field, value) => onFieldChange(field, value)}
        />
      );
      break;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-0 sm:px-4 md:px-8">
      {stepContent}
    </div>
  );
};

export default SignUpProfile;
