"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import JustGoHealth from "@/components/logo-purple";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useEffect, useState, Suspense } from "react";
import { formatTime, recoverSteps } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import Stepper from "@/components/stepper";
import { ArrowRightIcon } from "lucide-react";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface VerifyPasswordResetProps {
  email: string;
  onBack?: () => void;
}

const VerifyContent = ({
  email: propEmail,
  onBack,
}: VerifyPasswordResetProps) => {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120); // 2 minutes
  const searchParamEmail = useGetSearchParams("email");
  const email = propEmail || searchParamEmail;
  const router = useRouter();


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

  useEffect(() => {
    (async () => {
      if (!email) {
        router.push(ROUTES.provider.checkEmail);
      }

      // Make a request to sent email to user before countdown starts

      try {
        const response = await api(ENDPOINTS.recoverAccount, {
          method: "POST",
          body: JSON.stringify({ email: email as string }),
        });

        if (response.success) {
          // console.log("Email sent");
        } else {
          console.error(response.message || "The provided email is invalid");
        }
      } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        const errorMsg =
          error.response?.data?.message || "Sign in failed. Please try again.";
        console.error(errorMsg);
      } finally {
        // setIsLoading(false);
      }
    })();
  }, [email, router]);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center p-6 justify-between w-full">
        <JustGoHealth />
        <Link
          href={ROUTES.provider.auth}
          className="bg-gray-300 text-[#ed1c24] rounded-md px-6 py-1"
        >
          Sign In
        </Link>
      </div>
      <div className="grid place-items-center">
        <h1 className="lg:text-4xl md:text-3xl text-2xl text-center font-extrabold">
          Enter Verification Code
        </h1>
        <h2 className="text-xl text-wrap px-14 text-gray-500 font-medium text-center">
          A 6-digit verification code was just sent to{" "}
          {decodeURIComponent(email as string)}
        </h2>
        <div className="mt-5 text-center">
          <InputOTP
            className="text-green-600"
            maxLength={6}
            onComplete={
              () => {
                //console.log("OTP complete")
                router.push(`${ROUTES.provider.newPassword}?email=${email}`)
              }
            }
          >
            <InputOTPSlot index={0} className="otp-slot" />
            <InputOTPSlot index={1} className="otp-slot" />
            <InputOTPSlot index={2} className="otp-slot" />
            <InputOTPSlot index={3} className="otp-slot" />
            <InputOTPSlot index={4} className="otp-slot" />
            <InputOTPSlot index={5} className="otp-slot" />
          </InputOTP>
          <div className="flex items-center justify-center mt-5">
            <Button
              disabled={seconds > 0}
              onClick={() => {
                setSeconds(120);
                setIsRunning(true);
              }}
              className="rounded-md bg-[#2b3990] disabled:bg-[#2b3990]/50"
            >
              Resend code <ArrowRightIcon className="w-4 h-4" />
            </Button>
            <span className="ml-4 border w-10 h-10 flex items-center justify-center rounded-full p-2 text-sm">
              {formatTime(seconds)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex border-t border-gray-500 px-10 pt-5 items-center justify-between">
        <Button
          onClick={() => (onBack ? onBack() : router.back())}
          className="rounded-full px-8 py-1 border-4 bg-white text-[#955aa4] text-lg font-bold border-[#955aa4] uppercase flex items-center justify-center hover:bg-white"
        >
          Back
        </Button>
        <Stepper steps={recoverSteps} step="Verify" />
        <Button className="invisible rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase">
          Next
        </Button>
      </div>
    </div>
  );
};

const Verify = (props: VerifyPasswordResetProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent {...props} />
    </Suspense>
  );
};

export default Verify;
