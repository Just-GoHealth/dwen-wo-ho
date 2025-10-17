/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useAuthQuery from "@/hooks/queries/useAuthQuery";

interface SignUpVerificationProps {
  email: string;
  fullName: string;
  title: string;
  onNext: () => void;
}

const SignUpVerification = ({
  email,
  fullName,
  title,
  onNext,
}: SignUpVerificationProps) => {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120); // 2 minutes
  const [errorMessage, setErrorMessage] = useState("");

  const { verifyEmailMutation, checkEmailMutation } = useAuthQuery();

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
    setErrorMessage("");

    try {
      const response = await verifyEmailMutation.mutateAsync({
        code: value,
        email: email,
      });

      // Store the token for authenticated requests in profile setup
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      // Move to profile setup step
      onNext();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  return (
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
        {verifyEmailMutation.isPending ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Verifying your code...</p>
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
                disabled={seconds > 0 || checkEmailMutation.isPending}
                onClick={async () => {
                  try {
                    await checkEmailMutation.mutateAsync({ email });
                    setSeconds(120);
                    setIsRunning(true);
                    setErrorMessage("");
                  } catch (error: any) {
                    const errorMsg =
                      error.response?.data?.message ||
                      "Failed to resend code. Please try again.";
                    setErrorMessage(errorMsg);
                  }
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
              >
                {checkEmailMutation.isPending ? "Sending..." : "Resend code →"}
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
  );
};

export default SignUpVerification;
