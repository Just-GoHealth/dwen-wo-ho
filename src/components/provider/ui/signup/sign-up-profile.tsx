"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import PendingVerificationModal from "@/components/modals/pending-verification";
import PhotoStep from "./steps/photo-step";
import BioStep from "./steps/bio-step";
import SpecialtyStep from "./steps/specialty-step";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { calculateTimeAgo } from "@/lib/utils";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { ROUTES } from "@/constants/routes";

interface SignUpProfileProps {
  email: string;
  fullName: string;
  title: string;
  specialty?: string;
  profileImage?: string;
  isPending?: boolean;
  onBack?: () => void;
  startStep?: number;
  password?: string;
}

const SignUpProfile = ({
  email,
  fullName,
  title,
  specialty,
  profileImage,
  isPending,
  onBack,
  startStep = 0,
  password,
}: SignUpProfileProps) => {
  const [currentStep, setCurrentStep] = useState(startStep);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addSpecialtyMutation, updateProfileMutation, loginMutation } = useAuthQuery();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Enable polling only when pending modal is shown
  const { getProfileQuery } = useUserQuery({
    refetchInterval: showPendingModal ? 5000 : undefined,
  });

  // Watch for approval
  useEffect(() => {
    if (getProfileQuery.data?.applicationStatus === "APPROVED" || getProfileQuery.data?.applicationStatus === "ACTIVE") {
      router.push(ROUTES.provider.dashboard);
    }
  }, [getProfileQuery.data, router]);

  const [profileData, setProfileData] = useState({
    photo: null as string | null,
    phoneNumber: "",
    bio: "",
    specialty: "",
  });

  const [userInfo, setUserInfo] = useState({
    name: `${title} ${fullName}`,
    title: title,
    specialty: specialty || "",
    timeAgo: "Just now",
    profileImage: profileImage as string | undefined,
  });


  useEffect(() => {
    const isPendingParam = searchParams.get("pending") === "true";
    if (isPendingParam || isPending) {
      setShowPendingModal(true);
    }
  }, [searchParams, isPending]);

  // Update modal with fetched profile data
  useEffect(() => {
    if (showPendingModal && getProfileQuery.data) {
      const data = getProfileQuery.data;
      setUserInfo((prev) => ({
        ...prev,
        name: `${(data as any).title ? `${(data as any).title} ` : ""}${data.providerName || prev.name}`,
        // If professionalTitle is available in response use it, else fallback
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        title: (data as any).professionalTitle || data.specialty || prev.title,
        specialty: data.specialty || prev.specialty,
        profileImage: data.profilePhotoURL,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timeAgo: (data as any).applicationDate ? calculateTimeAgo((data as any).applicationDate) : prev.timeAgo,
      }));
    }
  }, [showPendingModal, getProfileQuery.data]);


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
        const response = await updateProfileMutation.mutateAsync({
          officePhoneNumber: profileData.phoneNumber,
          status: profileData.bio,
        });

        // Capture response data for Pending Modal usage
        if (response?.success && response?.data) {
          const data = response.data;
          setUserInfo(prev => ({
            ...prev,
            name: `${(data as any).title ? `${(data as any).title} ` : ""}${data.providerName || prev.name}`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            title: (data as any).professionalTitle || data.specialty || prev.title,
            specialty: data.specialty || prev.specialty,
            profileImage: data.profilePhotoURL || prev.profileImage,
            // Calculate time ago based on application date if available, or keep existing
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            timeAgo: (data as any).applicationDate ? calculateTimeAgo((data as any).applicationDate) : prev.timeAgo,
          }));

          console.log("✅ Profile info updated from Bio step response:", data);
        }

        toast.success("Profile updated successfully!");
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error("Profile update error:", error);
        toast.error(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.message || "Failed to update profile. Please try again."
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
        console.log("Adding specialty...");
        await addSpecialtyMutation.mutateAsync({
          specialty: profileData.specialty,
        });

        toast.success("Specialty added successfully!");

        // Auto-login if password is available
        if (password) {
          console.log("Attempting auto-login...");
          try {
            const loginResponse = await loginMutation.mutateAsync({
              email: email,
              password: password,
            });

            if (loginResponse.success) {
              const { token, userData } = loginResponse.data;
              if (token) {
                localStorage.setItem("token", token);
              }

              // Check logic similar to signin.tsx
              const isPendingStatus = userData.applicationStatus === "PENDING" || (loginResponse as any).message === "ACCOUNT PENDING";
              const isVerified = loginResponse.data.isVerified;

              if (isPendingStatus || isVerified === false) {
                // Update user info for modal
                setUserInfo(prev => ({
                  ...prev,
                  name: userData.providerName || prev.name,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  title: (userData as any).professionalTitle || userData.specialty || prev.title,
                  specialty: userData.specialty || prev.specialty,
                  profileImage: userData.profilePhotoURL || prev.profileImage,
                }));
                setShowPendingModal(true);
              } else {
                console.log("✅ Auto-login successful, redirecting to schools grid");
                router.push(ROUTES.curator.schools);
              }
            } else {
              // Login failed logically? Fallback to auth page
              console.warn("Auto-login returned failure:", loginResponse);
              router.push(`${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(email)}`);
            }
          } catch (loginError) {
            console.error("Auto-login error:", loginError);
            // If login fails (e.g. 401), fallback to sign-in page
            router.push(`${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(email)}`);
          }
        } else {
          // No password (e.g. came from email link), fallback to sign-in page
          router.push(`${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(email)}`);
        }

      } catch (error) {
        console.error("Specialty submission error:", error);
        toast.error(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.message || "Failed to add specialty. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // if it is an image, move on to the next since we already uploaded image in the photo step
    if (currentStep === 0) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Move to next step (fallback)
    setCurrentStep((prev) => prev + 1);

  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Photo
        return (
          <PhotoStep
            profilePhoto={profileData.photo}
            onChange={(field, value) => handleChange(field, value)}
            onNext={handleNext}
            onBack={handleBack}
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
    <>
      {/* Photo step has its own complete layout, render with flex wrapper to push nav to bottom */}
      {currentStep === 0 ? (
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <PhotoStep
              profilePhoto={profileData.photo}
              onChange={(field, value) => handleChange(field, value)}
              onNext={handleNext}
              onBack={handleBack}
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col pb-10">
          {/* Main Content */}
          <div className="flex-1  flex flex-col justify-center">
            <div className="w-full max-w-4xl mx-auto">{renderStepContent()}</div>
          </div>

          {/* Bottom Navigation - Flex column footer (pushed to bottom by flex-1 above) */}
          <div className="flex flex-col sm:flex-row border-t border-gray-500 px-4 sm:px-6 lg:px-6 py-4 items-center justify-between space-y-4 sm:space-y-0 mt-8 fixed bottom-0 right-0 w-full lg:w-1/2 bg-white">
            <Button
              onClick={handleBack}
              className="rounded-full mr-2 px-8 py-1 border-4 bg-white text-[#955aa4] text-lg font-bold border-[#955aa4] uppercase flex items-center justify-center hover:bg-white"
            >
              Back
            </Button>

            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-4 text-sm">
                {/* Photo Step */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${currentStep >= 0 ? "bg-black" : "border-2 border-gray-400"
                      }`}
                  />
                  <span
                    className={`${currentStep >= 0
                      ? "font-semibold text-black"
                      : "text-gray-400"
                      }`}
                  >
                    1. Photo
                  </span>
                </div>
                <span className="text-gray-400">—</span>

                {/* Bio Step */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${currentStep >= 1
                      ? "bg-black"
                      : "border-2 border-gray-400"
                      }`}
                  />
                  <span
                    className={`${currentStep >= 1
                      ? "font-semibold text-black"
                      : "text-gray-400"
                      }`}
                  >
                    2. Bio
                  </span>
                </div>
                <span className="text-gray-400">—</span>

                {/* Specialty Step */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${currentStep >= 2
                      ? "bg-black"
                      : "border-2 border-gray-400"
                      }`}
                  />
                  <span
                    className={`${currentStep >= 2
                      ? "font-semibold text-black"
                      : "text-gray-400"
                      }`}
                  >
                    3. Specialty
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={isSubmitting || (currentStep === 2 && !profileData.specialty)}
              className="rounded-full ml-2 px-8 py-1 border-4 text-lg font-bold uppercase transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#955aa4]/80 text-white border-[#955aa4] hover:bg-[#955aa4] disabled:hover:bg-[#955aa4]/80"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : currentStep === 2 ? (
                "Submit"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Pending Verification Modal */}
      <PendingVerificationModal
        isOpen={showPendingModal}
        isLoading={getProfileQuery.isLoading}
        onClose={() => setShowPendingModal(false)}
        userInfo={userInfo}
      />
    </>
  );
};

export default SignUpProfile;
