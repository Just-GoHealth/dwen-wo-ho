"use client";

import JustGoHealth from "@/components/logo-purple";
import { Button } from "@/components/ui/button";
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
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.message === "User not found" ||
        (error as any)?.response?.data?.message === "User not found"
      ) {
        // Proceed to create user
        onEmailSubmit(email, false);
        return;
      }

      console.error("Error checking email:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setErrorMessage(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.response?.data?.message || (error as any)?.message || "Failed to verify email"
      );
    }
  };

  const { register, handleSubmit, errors } =
    useSelectedValuesFromReactHookForm(ProviderEmailSchema, {
      mode: "onChange",
    });



  const onSubmit = (values: ProviderEmailFormData) => {
    checkEmailExists(values.email);
  };

  return (
    <>
      <LoadingOverlay
        text="Verifying email..."
        isVisible={checkEmailMutation.isPending}
      />
      <div className="min-h-screen h-full flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 backdrop-blur-[100px]"></div>

        <div className="relative z-10 flex items-center px-8 justify-between w-full pt-8">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <JustGoHealth />
          </div>
          <Link
            href={ROUTES.patient.checkEmail}
            className="bg-gray-200 text-red-500 rounded-full px-4 py-2 text-md font-semibold hover:bg-gray-300 transition-colors"
          >
            Switch to Patients
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-12">
          <div className="w-full max-w-xl">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-10">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-medium mb-4">
                  Enter your email to <span className="text-[#955aa4]">Sign In</span> or <span className="text-[#955aa4]">Sign Up</span> as a Provider.
                </h1>
              </div>

              <form
                id="email-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="relative">
                  <div className="">
                    <div className="w-full">
                      <label htmlFor="" className="ml-3 text-gray-500 text-xl font-semibold">Email</label>
                      <div className="flex items-center bg-[#2bb673] rounded-lg p-1">
                        <input
                          {...register("email")}
                          placeholder="Enter your email address"
                          className={`w-full px-6 py-3 rounded-lg bg-white text-[#2bb673] font-semibold text-lg placeholder-gray-500 focus:outline-none ${errors?.email ? "text-red-600" : "text-green-600"
                            }`}
                        />
                        <Button
                          type="submit"
                          variant="ghost"
                          disabled={checkEmailMutation.isPending || !!errors?.email}
                          className={`px-6 h-auto transition-all duration-300 ${!errors?.email && !checkEmailMutation.isPending
                            ? "bg-[#2bb673] text-white transform"
                            : "bg-gray-400/50 text-gray-500 cursor-not-allowed"
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
              <h1 className="text-center text-3xl font-extrabold mt-10 text-[#955aa4]">JustGo Health Providers</h1>
              <p className="text-center text-lg font-medium mt-3">There are thousands of students out there hoping for someone like you. Welcome</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckEmail;
