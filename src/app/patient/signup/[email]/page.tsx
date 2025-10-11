"use client";

import { useParams, useRouter } from "next/navigation";
import JustGoHealth from "@/components/logo-purple";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { formatTime, signUpSteps } from "@/lib/utils";
import Stepper from "@/components/stepper";

const Verify = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120); // 2 minutes
  const params = useParams();
  const { email } = params;

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

  const router = useRouter();

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center px-8 justify-between w-full">
        <JustGoHealth />
        <p className="font-bold">
          for <span className="text-4xl">Patients</span>
        </p>
      </div>
      <div className="grid place-items-center">
        <h1 className="text-xl lg:text-3xl md:text-3xl  text-center font-extrabold">
          Enter Verification Code
        </h1>
        <h2 className="text-2xl text-gray-500 font-medium text-center">
          A 6-digit verification code was just<br/> sent to{" "}
          {decodeURIComponent(email as string)}
        </h2>
        <div className="mt-5 text-center">
          <InputOTP
            maxLength={6}
            onComplete={(value) => console.log(value)}
            size={40}
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
              className="rounded-md mt-4 disabled:bg-gray-300"
            >
              Resend code &gt;
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
        <Stepper steps={signUpSteps} step="Verify" />
        <Button className="invisible rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase">
          Next
        </Button>
      </div>
    </div>
  );
};

export default Verify;
