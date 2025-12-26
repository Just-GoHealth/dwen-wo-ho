/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import JustGoHealth from "@/components/logo-purple";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { ROUTES } from "@/constants/routes";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/useSelectedValuesFromReactHookForm";
import {
  CuratorEmailSchema,
  CuratorEmailFormData,
} from "@/schemas/curator.auth.schema";

interface CheckEmailProps {
  onEmailSubmit: (email: string) => void;
}

const CheckEmail = ({ onEmailSubmit }: CheckEmailProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const checkEmailExists = async (email: string) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await api.curatorCheckEmail({ email, password: "" });

      if (response && response.success) {
        onEmailSubmit(email);
      } else {
        setErrorMessage(
          "Curator email not found. Please contact administrator."
        );
      }
    } catch (error: any) {
      console.error("Error checking curator email:", error);
      setErrorMessage("Curator email not found. Please contact administrator.");
    } finally {
      setIsLoading(false);
    }
  };

  const { register, handleSubmit, errors, watch } =
    useSelectedValuesFromReactHookForm(CuratorEmailSchema, {
      mode: "onChange",
    });

  // Watch the email field for real-time value
  const emailValue = watch("email");

  const onSubmit = (values: CuratorEmailFormData) => {
    checkEmailExists(values.email);
  };

  return (
    <>
      <LoadingOverlay
        text="Verifying curator access..."
        isVisible={isLoading}
      />
      <div className="min-h-screen h-full flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 via-purple-500/10 to-pink-400/20"></div>
        <div className="absolute inset-0 backdrop-blur-[100px]"></div>

        <div className="relative z-10 flex items-center px-8 justify-between w-full pt-8">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <JustGoHealth />
          </div>
          <button className="bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-full px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10 border border-white/20">
            Switch to Providers
          </button>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-12">
          <div className="w-full max-w-xl">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  Curator Portal
                </h1>
                <p className="text-gray-600 text-xl font-medium">
                  Enter your curator email to continue
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-600 text-sm font-medium">
                    Secure Access
                  </span>
                </div>
              </div>

              <form
                id="email-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="relative group">
                  <div className="flex rounded-2xl overflow-hidden backdrop-blur-sm bg-white/20 border border-white/30 shadow-lg">
                    <input
                      {...register("email")}
                      placeholder="curator@justgohealth.com"
                      className={`flex-1 px-6 py-5 bg-transparent text-gray-700 font-semibold text-lg placeholder-gray-500 focus:outline-none ${errors?.email ? "text-red-600" : "text-green-600"
                        }`}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      disabled={isLoading}
                      className={`px-6 h-auto transition-all duration-300 ${!errors?.email && !isLoading
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                          : "bg-gray-400/50 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {isLoading ? (
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
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {errorMessage && (
                  <div className="backdrop-blur-sm bg-red-500/10 border border-red-400/30 rounded-xl p-4 animate-pulse">
                    <p className="text-red-700 text-center font-medium">
                      {errorMessage}
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Don't have curator access?
                    <span className="text-purple-600 font-semibold ml-1 cursor-pointer hover:text-purple-800 transition-colors">
                      Contact administrator
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between px-12 pb-8">
          <Button
            onClick={() => router.replace("/")}
            className="backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 text-purple-700 font-bold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ← Back
          </Button>

          <div className="text-center">
            <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-6 py-2">
              <p className="text-purple-700 font-semibold">Curator Portal</p>
            </div>
          </div>

          <div className="w-24"></div>
        </div>
      </div>
    </>
  );
};

export default CheckEmail;
