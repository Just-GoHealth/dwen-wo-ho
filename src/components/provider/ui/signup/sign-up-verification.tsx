
"use client";

import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { toast } from "sonner";

interface SignUpVerificationProps {
  email: string;
  onNext: () => void;
}

const SignUpVerification = ({
  email,
  onNext,
}: SignUpVerificationProps) => {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120); // 2 minutes
  const [errorMessage, setErrorMessage] = useState("");

  const { verifyEmailMutation, sendVerificationEmailMutation } = useAuthQuery();

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

    console.log("=== OTP VERIFICATION STARTED ===");
    console.log("Email:", email);
    console.log("Code entered:", value);

    try {
      // First, verify the code
      console.log("🔑 Step 1: Verifying OTP code...");

      const verifyResponse = await verifyEmailMutation.mutateAsync({
        code: value,
        email: email.trim(),
      });

      console.log("✅ Verification response:", verifyResponse);

      // Check for success using the flag from the response
      if (verifyResponse?.success) {
        console.log("✅ Verification successful! Proceeding to Profile Setup...");

        // Extract token based on the provided JSON structure
        const token = verifyResponse.data?.token;

        if (token) {
          console.log("🔑 Token received, storing in localStorage:", token.substring(0, 10) + "...");
          localStorage.setItem("token", token);

          // Show success message
          toast.success("Account verified successfully");

          // Proceed to next step
          onNext();
        } else {
          console.error("❌ Verification successful but no token found:", verifyResponse);
          setErrorMessage("Verification succeeded but login failed. Please try logging in.");
          toast.error("Verification error: No token received");
        }
      } else {
        console.error("❌ Verification failed - success flag false");
        const msg = verifyResponse?.message || "Verification failed. Please try again.";
        setErrorMessage(msg);
        toast.error(msg);
      }
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error("❌ ERROR during verification/signup process:", error);

      let errorMsg = "Verification failed. Please try again.";

      // Try to extract message from different possible error structures
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        try {
          if (error.message.trim().startsWith('{')) {
            const parsed = JSON.parse(error.message);
            errorMsg = parsed.message || error.message;
          } else {
            errorMsg = error.message;
          }
        } catch {
          errorMsg = error.message;
        }
      }

      setErrorMessage(errorMsg);
      toast.error(errorMsg);
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
          <span className="font-semibold text-[#955aa4]">{email}</span>
        </p>
      </div>
      {/* OTP Input Section */}
      <div className="text-center space-y-6">
        {verifyEmailMutation.isPending ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-[#955aa4] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">
              {verifyEmailMutation.isPending ? "Verifying your code..." : "Creating your account..."}
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
                disabled={seconds > 0 || sendVerificationEmailMutation.isPending}
                onClick={async () => {
                  try {
                    await sendVerificationEmailMutation.mutateAsync({ email });
                    setSeconds(120);
                    setIsRunning(true);
                    setErrorMessage("");
                  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                    let errorMsg = "Failed to resend code. Please try again.";

                    if (error.response?.data?.message) {
                      errorMsg = error.response.data.message;
                    } else if (error.message) {
                      try {
                        if (error.message.trim().startsWith('{')) {
                          const parsed = JSON.parse(error.message);
                          errorMsg = parsed.message || error.message;
                        } else {
                          errorMsg = error.message;
                        }
                      } catch {
                        errorMsg = error.message;
                      }
                    }
                    setErrorMessage(errorMsg);
                  }
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium bg-[#955aa4] text-white hover:bg-[#955aa4]/80 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
              >
                {sendVerificationEmailMutation.isPending ? "Sending..." : "Resend code →"}
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
