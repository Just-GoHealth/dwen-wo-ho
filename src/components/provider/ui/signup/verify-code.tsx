/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import JustGoHealth from "@/components/logo-purple";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { formatTime, signUpSteps } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import Stepper from "@/components/stepper";
import { api } from "@/lib/api";
import Link from "next/link";

interface VerifyCodeProps {
  email: string;
  fullName: string;
  title: string;
  onNext: () => void;
  onBack: () => void;
}

const VerifyCode = ({
  email,
  fullName,
  title,
  onNext,
  onBack,
}: VerifyCodeProps) => {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120); // 2 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, seconds]);

  const handleOTPComplete = async (value: string) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.submitSignupCode({
        code: value,
        email: email,
      });

      if (response.success) {
        // Move to profile setup step
        onNext();
      } else {
        setErrorMessage(response.message || "Verification failed");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      //   await api.resendVerificationCode(email);
      setSeconds(120);
      setIsRunning(true);
    } catch (error) {
      console.error("Failed to resend code", error);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center px-4 sm:px-6 lg:px-8 justify-between w-full">
        <JustGoHealth />
        <Link
          href={ROUTES.provider.singIn}
          className="bg-gray-300 text-red-500 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-400 transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enter Verification Code
            </h1>
            <p className="text-gray-600">
              A 6-digit verification code was just sent to{" "}
              <span className="font-semibold text-purple-600">{email}</span>
            </p>
          </div>

          {/* OTP Input Section */}
          <div className="text-center space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">
                  Verifying your code...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    onComplete={handleOTPComplete}
                    size={40}
                    className="flex justify-center"
                  >
                    <InputOTPSlot index={0} className="otp-slot" />
                    <InputOTPSlot index={1} className="otp-slot" />
                    <InputOTPSlot index={2} className="otp-slot" />
                    <InputOTPSlot index={3} className="otp-slot" />
                    <InputOTPSlot index={4} className="otp-slot" />
                    <InputOTPSlot index={5} className="otp-slot" />
                  </InputOTP>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button
                    disabled={seconds > 0}
                    onClick={handleResendCode}
                    className="rounded-lg px-4 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
                  >
                    Resend code →
                  </Button>
                  <span className="text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                    {formatTime(seconds)}
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-center text-sm font-medium">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row border-t border-gray-500 px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 items-center justify-between space-y-4 sm:space-y-0">
        <Button
          onClick={onBack}
          className="rounded-full px-3 sm:px-4 lg:px-6 border-2 sm:border-4 bg-white text-[#955aa4] text-sm sm:text-base lg:text-xl font-bold border-[#955aa4] uppercase w-full sm:w-auto"
        >
          Back
        </Button>
        <div className="flex-1 flex justify-center">
          <Stepper steps={signUpSteps} step="Verify" />
        </div>
        <Button className="invisible rounded-full px-3 sm:px-4 lg:px-6 border-2 sm:border-4 bg-white text-[#955aa4] text-sm sm:text-base lg:text-xl font-bold border-[#955aa4] uppercase w-full sm:w-auto">
          Next
        </Button>
      </div>
    </div>
  );
};

export default VerifyCode;
