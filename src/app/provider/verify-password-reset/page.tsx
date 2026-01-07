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

const VerifyContent = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120); // 2 minutes
  const email = useGetSearchParams("email");
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
      } catch (error: unknown) {
        const errorMsg =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Sign in failed. Please try again.";
        console.error(errorMsg);
      } finally {
        // setIsLoading(false);
      }
    })();
  }, [email, router]);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center px-8 justify-between w-full">
        <JustGoHealth />
        <Link
          href={ROUTES.provider.singIn}
          className="bg-gray-300 text-[#ed1c24] rounded-full px-4 py-1"
        >
          Sign In
        </Link>
      </div>
      <div className="grid place-items-center">
        <h1 className="lg:text-3xl md:text-3xl text-2xl text-center font-extrabold">
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
            onComplete={() =>
              router.push(`${ROUTES.provider.newPassword}?email=${email}`)
            }
          >
            <InputOTPSlot index={0} className="otp-slot" />
            <InputOTPSlot index={1} className="otp-slot" />
            <InputOTPSlot index={2} className="otp-slot" />
            <InputOTPSlot index={3} className="otp-slot" />
            <InputOTPSlot index={4} className="otp-slot" />
            <InputOTPSlot index={5} className="otp-slot" />
          </InputOTP>
          <div>
            <Button
              disabled={seconds > 0}
              onClick={() => {
                setSeconds(120);
                setIsRunning(true);
              }}
              className="rounded-md mt-4 bg-[#2b3990] disabled:bg-[#2b3990]/50"
            >
              Resend code <ArrowRightIcon className="w-4 h-4" />
            </Button>
            <span className="ml-4 border rounded-full p-2 text-sm">
              {formatTime(seconds)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex border-t border-gray-500 px-10 pt-5 items-center justify-between">
        <Button
          onClick={() => router.back()}
          className="rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase"
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

const Verify = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
};

export default Verify;
