"use client";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { BaseSignInFormProps } from "@/lib/types/components/auth/base-sign-in";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/shared/use-hydrated";
import type { AuthAudience } from "@/lib/types/components/auth/base-sign-in";
import { ApiErrorNote } from "@/components/shared/api-error-note";

const AUDIENCE_LABELS: Record<AuthAudience, string> = {
  provider: "Providers",
  curator: "Curators",
};

export const BaseSignInForm = ({
  audience,
  email,
  register,
  errors,
  onSubmit,
  onBack,
  onRecoverAccount,
  isLoading,
  isRecovering,
  successMessage,
  apiError,
  secondsLeft = 0,
}: BaseSignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const mounted = useHydrated();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 flex h-full min-h-screen flex-col justify-between gap-10 py-4 duration-700 sm:py-8">
      <div className="flex w-full items-center justify-between px-4 sm:px-8">
        <Logo
          variant={mounted && theme === "light" ? "black" : "white"}
          className="h-auto w-[140px] sm:w-auto"
        />
        <p className="text-muted-foreground text-lg font-bold sm:text-2xl">
          <span className="text-sm font-normal">for </span>
          {AUDIENCE_LABELS[audience]}
        </p>
      </div>

      <form
        id="login-form"
        onSubmit={onSubmit}
        className="mx-auto w-full max-w-md space-y-8 px-4 sm:px-8 md:px-12"
      >
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>

        {successMessage && (
          <p className="text-success text-center text-sm font-medium">
            {successMessage}
          </p>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="pl-1 text-base font-medium">Email</Label>
            <Input
              {...register("email")}
              defaultValue={email}
              readOnly
              tabIndex={-1}
              placeholder={
                email ? undefined : "Enter your email on the previous step"
              }
              className="bg-muted text-foreground border-input h-12 cursor-not-allowed font-medium opacity-100 disabled:opacity-100"
            />
          </div>

          <div className="space-y-2">
            <Label className="pl-1 text-base font-medium">Password</Label>
            <div className="relative">
              <Input
                {...register("password")}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                className={`h-12 pr-16 pl-4 transition-all duration-200 ${
                  errors?.password
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : "border-input focus-visible:ring-primary/30"
                }`}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showPassword ? (
                  <span className="text-xs font-semibold">HIDE</span>
                ) : (
                  <span className="text-xs font-semibold">SHOW</span>
                )}
              </Button>
            </div>
            {errors?.password && (
              <p className="text-destructive pl-1 text-sm font-medium">
                {errors.password.message as string}
              </p>
            )}
          </div>
        </div>

        {apiError?.code !== "INCORRECT_PASSWORD" && (
          <ApiErrorNote error={apiError ?? null} secondsLeft={secondsLeft} />
        )}
        {apiError?.code === "INCORRECT_PASSWORD" && secondsLeft > 0 && (
          <ApiErrorNote error={apiError} secondsLeft={secondsLeft} />
        )}

        <div className="pt-2">
          <LoadingButton
            form="login-form"
            type="submit"
            loading={isLoading}
            loadingText="Signing In..."
            disabled={
              !email || Object.keys(errors).length > 0 || secondsLeft > 0
            }
            className="h-12 w-full rounded-lg text-lg font-bold shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </LoadingButton>
        </div>

        <div className="pt-4 text-center">
          <LoadingButton
            type="button"
            variant="link"
            onClick={onRecoverAccount}
            loading={isRecovering}
            loadingText="Sending recovery email..."
            className="text-muted-foreground hover:text-primary h-auto p-0 font-normal transition-colors"
          >
            Forgot your password?
          </LoadingButton>
        </div>
      </form>

      <div className="border-border flex items-center justify-center border-t px-8 pt-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground group flex items-center gap-2"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>{" "}
          Back to email
        </Button>
      </div>
    </div>
  );
};
