"use client";

import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { formatElapsedSeconds as formatTime } from "@/lib/utils/shared/time-ago";
import { LoadingButton } from "@/components/ui/loading-button";
import { Spinner } from "@/components/ui/spinner";
import { SignUpVerificationProps } from "@/lib/types/components/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { ApiErrorNote } from "@/components/shared/api-error-note";
import { useSignUpVerification } from "@/hooks/components/provider/auth/signup/sign-up-verification/use-sign-up-verification";

const SignUpVerification = (props: SignUpVerificationProps) => {
  const { email } = props;
  const {
    seconds,
    isVerifying,
    isResending,
    apiError,
    handleOTPComplete,
    handleResendCode,
    otpInputRef,
  } = useSignUpVerification(props);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto w-full max-w-md space-y-8 duration-700">
      {/* Header Section */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {SIGN_UP_TEXTS.verification.title}
        </h1>
        <p className="text-muted-foreground">
          {SIGN_UP_TEXTS.verification.subtitle}{" "}
          <span className="text-foreground mt-1 block font-semibold">
            {email}
          </span>
        </p>
      </div>

      {/* OTP Input Section */}
      <div className="space-y-8 text-center">
        {isVerifying ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Spinner className="text-primary size-10" />
            <p className="text-muted-foreground animate-pulse font-medium">
              {SIGN_UP_TEXTS.verification.verifying}
            </p>
          </div>
        ) : (
          <div className="mx-auto flex w-fit flex-col gap-8">
            <InputOTP
              ref={otpInputRef}
              maxLength={6}
              onComplete={handleOTPComplete}
              containerClassName="gap-2 flex justify-center"
            >
              <InputOTPSlot
                index={0}
                className="border-input bg-muted/30 focus:border-primary focus:ring-primary h-14 w-12 rounded-lg border text-2xl font-bold transition-all duration-200 focus:ring-1"
              />
              <InputOTPSlot
                index={1}
                className="border-input bg-muted/30 focus:border-primary focus:ring-primary h-14 w-12 rounded-lg border text-2xl font-bold transition-all duration-200 focus:ring-1"
              />
              <InputOTPSlot
                index={2}
                className="border-input bg-muted/30 focus:border-primary focus:ring-primary h-14 w-12 rounded-lg border text-2xl font-bold transition-all duration-200 focus:ring-1"
              />
              <InputOTPSlot
                index={3}
                className="border-input bg-muted/30 focus:border-primary focus:ring-primary h-14 w-12 rounded-lg border text-2xl font-bold transition-all duration-200 focus:ring-1"
              />
              <InputOTPSlot
                index={4}
                className="border-input bg-muted/30 focus:border-primary focus:ring-primary h-14 w-12 rounded-lg border text-2xl font-bold transition-all duration-200 focus:ring-1"
              />
              <InputOTPSlot
                index={5}
                className="border-input bg-muted/30 focus:border-primary focus:ring-primary h-14 w-12 rounded-lg border text-2xl font-bold transition-all duration-200 focus:ring-1"
              />
            </InputOTP>

            <LoadingButton
              variant={seconds > 0 ? "outline" : "default"}
              loading={isResending}
              loadingText={SIGN_UP_TEXTS.verification.resending}
              disabled={seconds > 0}
              onClick={handleResendCode}
              className="hover:bg-muted/50 h-12 w-full text-base font-medium transition-colors"
            >
              {seconds > 0 ? (
                <span className="flex items-center gap-2">
                  Resend code in{" "}
                  <span className="text-primary w-8 font-bold">
                    {formatTime(seconds)}
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {SIGN_UP_TEXTS.verification.resend}
                </span>
              )}
            </LoadingButton>
            <ApiErrorNote error={apiError} secondsLeft={seconds} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpVerification;
