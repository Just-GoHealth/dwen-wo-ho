"use client";

import { Suspense } from "react";
import { useHydrated } from "@/hooks/shared/use-hydrated";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import Stepper from "@/components/miscellaneous/stepper";
import { RECOVER_STEPS as recoverSteps } from "@/lib/constants/components/shared/auth-flow";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/provider/auth/auth-copy";
import { useTheme } from "next-themes";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import NewPasswordForm from "../new-password-form";
import { useNewPassword } from "@/hooks/components/provider/auth/new-password/use-new-password";

const NewPasswordContent = () => {
  const {
    email,
    showPassword,
    setShowPassword,
    password,
    confirmPassword,
    isFormValid,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleBack,
    isSubmitting,
  } = useNewPassword();
  const { theme } = useTheme();
  const mounted = useHydrated();

  return (
    <div className="bg-app-gradient text-foreground flex min-h-screen flex-col transition-colors duration-300">
      <div className="bg-background/80 border-border/50 sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Logo variant={mounted && theme === "light" ? "black" : "white"} />
          <p className="hidden text-xl font-semibold sm:block">
            <span className="text-muted-foreground mr-2 text-sm font-normal">
              {SIGN_UP_TEXTS.header.for}
            </span>
            {SIGN_UP_TEXTS.header.providers}
          </p>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-6 duration-700 sm:px-6 sm:py-8 lg:px-8">
        <NewPasswordForm
          email={email}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          password={password}
          confirmPassword={confirmPassword}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>

      <div className="bg-background/80 border-border sticky bottom-0 z-50 mt-auto flex flex-col items-center justify-between gap-4 border-t px-6 py-4 backdrop-blur-md transition-all duration-300 sm:flex-row">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground group order-2 flex items-center gap-2 rounded-full px-6 py-2 sm:order-1"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              <ArrowLeft className="size-4" />
            </span>{" "}
            {NEW_PASSWORD_TEXTS.form.back}
          </Button>

          <div className="order-1 flex w-full flex-1 justify-center sm:order-2 sm:w-auto">
            <Stepper steps={recoverSteps} step="New Password" />
          </div>

          <div className="order-3 flex w-full justify-end sm:w-auto">
            <Button
              form="new-password-form"
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full rounded-full px-8 shadow-lg transition-all hover:shadow-xl sm:w-auto"
            >
              {NEW_PASSWORD_TEXTS.form.savePassword}{" "}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewPassword = () => {
  return (
    <Suspense
      fallback={
        <div className="bg-app-gradient flex h-screen w-full items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <NewPasswordContent />
    </Suspense>
  );
};

export default NewPassword;
