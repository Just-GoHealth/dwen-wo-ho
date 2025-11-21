"use client";

import JustGoHealth from "@/components/logo-purple";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/useSelectedValuesFromReactHookForm";
import {
  ProviderEmailSchema,
  ProviderEmailFormData,
} from "@/schemas/provider.auth.schema";
import Link from "next/link";
import useAuthQuery from "@/hooks/queries/useAuthQuery";

interface CheckEmailProps {
  onEmailSubmit: (email: string, emailExists: boolean) => void;
}

const CheckEmail = ({ onEmailSubmit }: CheckEmailProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { checkEmailMutation } = useAuthQuery();

  const checkEmailExists = async (email: string) => {
    try {
      setErrorMessage("");
      const response = await checkEmailMutation.mutateAsync({ email });

      if (response.success) {
        onEmailSubmit(email, response.data?.emailExists || false);
      } else {
        setErrorMessage(response.message || "Failed to verify email");
      }
    } catch (error: any) {
      console.error("Error checking email:", error);
      if (error.response?.data?.message == "User not found") {
        // Proceed to create user
        onEmailSubmit(email, false);
      }
      setErrorMessage(
        error.response?.data?.message || "Failed to verify email"
      );
    }
  };

  const { register, handleSubmit, errors, watch } =
    useSelectedValuesFromReactHookForm(ProviderEmailSchema, {
      mode: "onChange",
    });

  const emailValue = watch("email");

  const onSubmit = (values: ProviderEmailFormData) => {
    checkEmailExists(values.email);
  };

  return (
    <>
      <LoadingOverlay
        text="Verifying email..."
        isVisible={checkEmailMutation.isPending}
      />
      <div className="min-h-screen h-full flex flex-col justify-between relative overflow-hidden bg-white">

        <div className="relative z-10 flex items-center px-8 justify-between w-full pt-8">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <JustGoHealth />
          </div>
          <Link
            href={ROUTES.patient.checkEmail}
            className="bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-full px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10 border border-white/20"
          >
            Switch to Patients
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-12">
          <div className="w-full max-w-xl">
            <div className="p-10">
              <div className="text-center mb-8">
                <p className="text-3xl font-medium text-black">
                  Enter your email to <span className="text-[#993399]">Sign In</span> or
                  <span className="text-[#993399]"> Sign Up</span> as a Provider
                </p>
              </div>

              <form
                id="email-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="block text-lg font-semibold text-black"
                  >
                    Email
                  </Label>
                  <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-3 py-1 transition-all focus-within:border-[#339933]">
                    <input
                      id="email"
                      {...register("email")}
                      placeholder="Enter your email address"
                      className="flex-1 bg-transparent px-3 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      disabled={
                        checkEmailMutation.isPending ||
                        !!errors?.email ||
                        !emailValue?.trim()
                      }
                      className={`h-11 px-4 bg-[#339933] text-white transition-colors duration-200 hover:bg-[#339933]/90 ${
                        checkEmailMutation.isPending ||
                        !!errors?.email ||
                        !emailValue?.trim()
                          ? "cursor-not-allowed bg-[#339933]/60 text-white hover:bg-[#339933]/60"
                          : ""
                      }`}
                    >
                      {checkEmailMutation.isPending ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Image
                          src="/arrow-vertical.png"
                          alt="Submit"
                          width={24}
                          height={24}
                          className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      )}
                    </Button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="backdrop-blur-sm bg-red-500/10 border border-red-400/30 rounded-xl p-4 animate-pulse">
                    <p className="text-red-700 text-center font-medium">
                      {errorMessage}
                    </p>
                  </div>
                )}
              </form>

              <div className="mt-10 text-center space-y-2">
                <h2 className="text-2xl font-semibold text-[#993399]">
                  JustGo Health Providers
                </h2>
                <p className="text-base text-gray-600">
                  There are thousands of students out there hoping for someone like
                  you. Welcome.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between px-12 pb-8">
          <Button
            onClick={() => router.replace("/")}
            className="backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 text-[#993399] font-bold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ← Back
          </Button>

          <div className="text-center">
            <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-6 py-2">
              <p className="text-[#993399] font-semibold">Provider Portal</p>
            </div>
          </div>

          <div className="w-24"></div>
        </div>
      </div>
    </>
  );
};

export default CheckEmail;
