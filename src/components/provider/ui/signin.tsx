/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import JustGoHealth from "@/components/logo-purple";
import { useEffect, useState, Suspense } from "react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

const SignInContent = ({
  email,
  onBack,
  onForgotPassword,
  onProfileIncomplete,
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
          console.log(response.data?.token);
          if (response.data?.token) {
            localStorage.setItem("token", response.data.token);
          }
          // Set user data and route to appropriate dashboard
          console.log(response.data?.userData);
          if (response.data.userData?.userRole == "ROLE_CURATOR") {
            router.replace(ROUTES.curator.schools);
          }
        }

        // Check if user is verified
        if (response.data?.isVerified === false) {
          setUserInfo({
            name: response.data?.fullName || "Dr. Amanda Gorman",
            title: response.data?.professionalTitle || "Clinical Psychologist",
            timeAgo: "2 hours ago",
          });
          setShowPendingModal(true);
        } else {
          // router.push(ROUTES.provider.profile);
          // If user is not verified, show pending modal
        }
      } else {
        setErrorMessage(response.message || "Sign in failed");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      const errorMsg = message || "Sign in failed. Please try again.";
      setErrorMessage(errorMsg);
      if (
        message == "Profile is not complete. Please upload your profile photo."
      ) {
        // Change to the sign-in flow and skip to the profile step
        onProfileIncomplete?.(0);
      } else if (
        message ==
        "Profile is not complete. Please update your office phone number."
      ) {
        onProfileIncomplete?.(1);
      } else if (
        message == "Profile is not complete. Please add your specialty."
      ) {
        onProfileIncomplete?.(2);
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
        onForgotPassword?.();
      } else {
        setErrorMessage(
          response.message || "Failed to send recovery email. Please try again."
        );
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to send recovery email. Please try again.";
      setErrorMessage(errorMsg);
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
        <button className="bg-gray-300 text-red-500 rounded-full px-4 py-1">
          Switch to Patients
        </button>
      </div>

      <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="px-12">
        <h1 className="text-5xl font-extrabold">Provider Sign In</h1>
        <div className="my-16">
          <div className="flex flex-col">
            <label className="text-2xl font-bold text-gray-500 pl-4">
              Email
            </label>
            <input
              {...register("email")}
              value={email as string}
              placeholder={email as string}
              disabled
              className={`font-bold w-full rounded-xl border-gray-300 border-4 text-2xl text-gray-500 p-4 bg-gray-200/50`}
            />
          </div>
          <div className="mt-4 flex flex-col">
            <label className="text-2xl font-bold text-gray-500 pl-4">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                placeholder="********"
                type={showPassword ? "text" : "password"}
                className={`font-bold w-full rounded-xl border-4 ${
                  errors?.password
                    ? "border-red-500 text-red-500"
                    : password?.length > 0
                    ? "border-green-600 text-green-600"
                    : "border-gray-300 text-gray-500"
                } text-2xl text-gray-500 p-4 bg-gray-200/50`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-0.5 transform -translate-x-1/2 -translate-y-1/2"
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

        <div className="text-center mt-4">
          {onForgotPassword ? (
            <button
              type="button"
              onClick={handleRecoverAccount}
              disabled={recoverAccountMutation.isPending}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {recoverAccountMutation.isPending
                ? "Sending email..."
                : "Don't remember your password? Recover account →"}
            </button>
          ) : (
            <Link
              href={`${ROUTES.provider.verifyPasswordReset}?email=${email}`}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
            >
              Don&apos;t remember your password? Recover account →
            </Link>
          )}
        </div>
      </form>

      <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
        <Button
          onClick={onBack}
          className="rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase"
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
          className={`text-xl px-6 py-2 border-4 font-bold rounded-md flex items-center gap-2 ${
            !password?.length ||
            loginMutation.isPending ||
            Object.keys(errors).length > 0
              ? "border-gray-400 text-gray-400 bg-gray-300 cursor-not-allowed"
              : "border-[#2b3990] text-white bg-[#955aa4] hover:bg-[#955aa4]/80"
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
