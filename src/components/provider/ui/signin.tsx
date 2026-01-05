/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import JustGoHealth from "@/components/logo-purple";
import { useEffect, useState, Suspense } from "react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import PendingVerificationModal from "@/components/modals/pending-verification";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/useSelectedValuesFromReactHookForm";
import {
  ProviderLoginSchema,
  ProviderLoginFormData,
} from "@/schemas/provider.auth.schema";
import useAuthQuery from "@/hooks/queries/useAuthQuery";

interface ProviderSignInProps {
  email: string;
  onBack: () => void;
  onForgotPassword?: () => void;
  onProfileIncomplete?: (step: number) => void;
}

const getCleanErrorMessage = (error: any): string => {
  let message = "An unexpected error occurred.";

  if (typeof error === "string") {
    message = error;
  } else if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  }

  // Try to parse if it looks like a JSON string
  if (typeof message === "string" && message.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(message);
      if (parsed.message) return parsed.message;
      if (parsed.error) return parsed.error;
    } catch {
      // Not JSON, continue with original message
    }
  }

  return message;
};

const SignInContent = ({
  email,
  onBack,
  onForgotPassword,
}: ProviderSignInProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPendingModal, setShowPendingModal] = useState(false);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    name: "Dr. Amanda Gorman",
    title: "Clinical Psychologist",
    timeAgo: "2 hours ago",
  });

  const { loginMutation, recoverAccountMutation } = useAuthQuery();

  const { register, handleSubmit, errors, watch } =
    useSelectedValuesFromReactHookForm(ProviderLoginSchema, {
      mode: "onChange",
      defaultValues: {
        email,
        password: "",
      },
    });

  const onSubmit = async (values: ProviderLoginFormData) => {
    setErrorMessage("");

    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      if (response.success) {
        if (response.data?.userData) {
          const { token, userData } = response.data;

          if (token) {
            localStorage.setItem("token", token);
          }

          console.log("LOGIN SUCCESS DATA:", userData);


          // Check for pending status
          if (userData.applicationStatus === "PENDING" || (response as any).message === "ACCOUNT PENDING") {
            const params = new URLSearchParams();
            params.set("email", values.email);
            params.set("step", "specialty"); // Keeps it at the end of the flow
            params.set("pending", "true");
            if (userData.providerName) params.set("name", userData.providerName);
            const title = (userData as any).professionalTitle || userData.specialty || "Dr.";
            params.set("title", title);

            if (userData.specialty) params.set("specialty", userData.specialty);
            if (userData.profilePhotoURL || userData.profileURL) params.set("photo", userData.profilePhotoURL || userData.profileURL);

            // Construct new URL: /provider/signup/[email]?params
            const emailEncoded = encodeURIComponent(values.email);
            // We remove email from params since it is in the path
            params.delete("email");

            router.push(`${ROUTES.provider.signUp}/${emailEncoded}?${params.toString()}`);
            return;
          }

          // Check for missing fields and route accordingly
          const emailParams = encodeURIComponent(values.email);

          if (!userData.profileURL) {
            console.log("Redirecting to Photo Step");
            router.push(`/provider/signup/${emailParams}?step=photo`);
            return;
          }

          if (!userData.officePhoneNumber) { // Bio step uses phone number
            console.log("Redirecting to Bio Step");
            router.push(`/provider/signup/${emailParams}?step=bio`);
            return;
          }

          if (!userData.specialty) {
            console.log("Redirecting to Specialty Step");
            router.push(`/provider/signup/${emailParams}?step=specialty`);
            return;
          }

          if (userData?.userRole == "ROLE_CURATOR") {
            router.replace(ROUTES.curator.schools);
            return;
          }

          // Default to profile if everything else is good
          // router.push(ROUTES.provider.profile);
        }

        // Check if user is verified (fallback logic if needed, but above checks should catch incomplete profiles first)
        if (response.data?.isVerified === false) {
          setUserInfo({
            name: response.data?.fullName || "Dr. Amanda Gorman",
            title: response.data?.professionalTitle || "Clinical Psychologist",
            timeAgo: "2 hours ago",
          });
          setShowPendingModal(true);
        } else {
          // If verified and complete (and not caught by above checks), go to dashboard/profile
          router.push(ROUTES.provider.profile);
        }
      } else {
        setErrorMessage(getCleanErrorMessage(response.message || "Sign in failed"));
      }
    } catch (error: any) {
      console.error("❌ Sign in error:", error);

      const errorMessage = getCleanErrorMessage(error);

      // Check for raw JSON error message that indicates pending account
      // This handles the case where api returns 400/500 but with specific JSON body
      let isPendingError = false;
      try {
        if (error?.message && error.message.includes("ACCOUNT PENDING")) {
          isPendingError = true;
        } else if (error?.response?.data?.message === "ACCOUNT PENDING") {
          isPendingError = true;
        }
      } catch {
        // ignore parsing error
      }

      if (isPendingError || errorMessage.includes("ACCOUNT PENDING")) {
        console.log("⚠️ Account pending error caught, redirecting...");

        const params = new URLSearchParams();
        // Email is now in the path, so we don't need it in params for the new route
        // params.set("email", values.email); 
        params.set("step", "specialty");
        params.set("pending", "true");

        // Fallback values since we might not have user data from a failed login
        // If token exists in localStorage, we might be able to use it later, 
        // but for now redirecting to the pending view is the priority.
        params.set("title", "Dr.");

        const emailEncoded = encodeURIComponent(values.email);
        router.push(`${ROUTES.provider.signUp}/${emailEncoded}?${params.toString()}`);
        return;
      }

      // Check for missing fields and route accordingly (using the cleaned message if applicable, or checking the error object structure if needed)
      // The original logic checked 'message' which was derived from error.message

      if (errorMessage.includes("Profile is not complete")) {
        console.log("⚠️ Profile incomplete, redirecting...");

        const emailEncoded = encodeURIComponent(email);

        if (errorMessage.includes("upload your profile photo")) {
          router.push(`/provider/signup/${emailEncoded}?step=photo`);
        } else if (errorMessage.includes("office phone number")) {
          router.push(`/provider/signup/${emailEncoded}?step=bio`);
        } else if (errorMessage.includes("add your specialty")) {
          router.push(`/provider/signup/${emailEncoded}?step=specialty`);
        } else {
          router.push(`/provider/signup/${emailEncoded}?step=photo`);
        }
      } else {
        setErrorMessage(errorMessage);
      }
    }
  };

  const handleRecoverAccount = async () => {
    setErrorMessage("");

    try {
      const response = await recoverAccountMutation.mutateAsync({
        email: email,
      });

      if (response.success) {
        // Navigate to reset password step after email is sent
        if (onForgotPassword) {
          onForgotPassword();
        } else {
          router.push(`${ROUTES.provider.verifyPasswordReset}?email=${email}`);
        }
      } else {
        setErrorMessage(
          response.message || "Failed to send recovery email. Please try again."
        );
      }
    } catch (error: any) {
      setErrorMessage(getCleanErrorMessage(error));
    }
  };

  // Watch password field for real-time validation
  const password = watch("password");

  useEffect(() => {
    if (!email) {
      onBack();
    }
  }, [email, onBack]);

  return (
    <div className="min-h-screen h-full flex flex-col py-8 justify-between">
      <div className="flex items-center px-8 justify-between w-full">
        <JustGoHealth />
        <p className="text-3xl font-bold"><span className="text-sm">for</span> Providers</p>
      </div>

      <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="px-24">
        <h1 className="text-5xl text-center font-extrabold">Sign in to your Accoun</h1>
        <div className="my-16">
          <div className="flex flex-col">
            <input
              {...register("email")}
              value={email as string}
              placeholder={email as string}
              disabled
              className={`font-bold w-full rounded-xl text-xl text-gray-500 p-4 bg-gray-200/50`}
            />
          </div>
          <div className="mt-4 flex flex-col">
            <label className="ml-3 text-gray-500 text-lg font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                placeholder="********"
                type={showPassword ? "text" : "password"}
                className={`font-bold w-full rounded-xl outline-none placeholder:text-gray-500 focus:border-3 focus:border-[#2bb673] ${errors?.password
                  ? "border-red-500 text-red-500"
                  : password?.length > 0
                    ? "border-[#2bb673] text-[#2bb673]"
                    : "border-gray-300 text-gray-500"
                  } text-xl text-gray-500 p-4 bg-gray-200/50`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-0.5 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 text-md font-semibold"
              >
                {!showPassword ? <span>SHOW</span> : <span>HIDE</span>}
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-center font-medium">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="text-center mt-6 flex justify-center items-center gap-2">
          <span className="text-gray-500 font-semibold text-lg">
            Don&apos;t remember password?
          </span>
          <button
            type="button"
            onClick={handleRecoverAccount}
            disabled={recoverAccountMutation.isPending}
            className="text-[#ed1c24] font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
          >
            {recoverAccountMutation.isPending
              ? "Sending email..."
              : "Recover Account >"}
          </button>
        </div>
      </form>

      <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
        <Button
          onClick={onBack}
          className="rounded-full px-8 py-1 border-4 bg-white text-[#955aa4] text-lg font-bold border-[#955aa4] uppercase flex items-center justify-center hover:bg-white"
        >
          Back
        </Button>
        <button
          form="login-form"
          type="submit"
          disabled={
            !password?.length ||
            loginMutation.isPending ||
            Object.keys(errors).length > 0
          }
          className={`text-lg px-8 py-1 border-4 font-bold rounded-md flex items-center gap-2 ${!password?.length ||
            loginMutation.isPending ||
            Object.keys(errors).length > 0
            ? "border-gray-400 text-gray-400 bg-gray-300 cursor-not-allowed"
            : "border-[#955aa4] text-white bg-[#955aa4]/60 hover:bg-[#955aa4]/80"
            }`}
        >
          {loginMutation.isPending && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {loginMutation.isPending ? "Signing In..." : "Sign In"}
        </button>
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

const ProviderSignIn = (props: ProviderSignInProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent {...props} />
    </Suspense>
  );
};

export default ProviderSignIn;
