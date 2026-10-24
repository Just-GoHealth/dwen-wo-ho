"use client";

import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSelect } from "@/components/ui/form-select";
import { SelectItem } from "@/components/ui/select";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { CreateAccountProps } from "@/lib/types/components/provider/auth";
import {
  SIGN_UP_TEXTS,
  PROFESSIONAL_TITLES,
} from "@/lib/constants/components/provider/auth/signup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/infra/routes";
import { useCreateAccount } from "@/hooks/components/provider/auth/signup/create-account/use-create-account";
import { Label } from "@/components/ui/label";
import { ApiErrorNote } from "@/components/shared/api-error-note";
import PasswordStrengthIndicator from "@/components/shared/password-strength-indicator/index";

const CreateAccount = (props: CreateAccountProps) => {
  const { agreedToTerms, onAgreedToTermsChange } = props;
  const {
    showPassword,
    setShowPassword,
    signupMutation,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleTitleChange,
    fullNameRegister,
    handleFullNameChange,
    handleFullNameBlur,
    isTitleSelectOpen,
    setIsTitleSelectOpen,
    email,
    title,
    fullName,
    password,
    apiError,
  } = useCreateAccount(props);

  return (
    <>
      <LoadingOverlay
        text={SIGN_UP_TEXTS.createAccount.verificationText}
        isVisible={signupMutation.isPending}
      />
      <form
        id="create-account-form"
        onSubmit={handleSubmit(onSubmit)}
        className="animate-in fade-in slide-in-from-bottom-8 mx-auto w-full max-w-lg space-y-8 px-8 duration-700"
      >
        {/* Header Section */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {SIGN_UP_TEXTS.createAccount.title}
          </h1>
          <p className="text-muted-foreground">
            Complete your profile to get started
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>
              Email<span className="text-destructive">*</span>
            </Label>
            <Input
              {...register("email")}
              value={email}
              placeholder={SIGN_UP_TEXTS.createAccount.emailPlaceholder}
              disabled
              className="bg-muted text-muted-foreground h-12 cursor-not-allowed text-lg font-medium"
            />
          </div>

          <div className="space-y-4">
            <Label>
              {SIGN_UP_TEXTS.createAccount.professionalTitle}
              <span className="text-destructive">*</span>
            </Label>
            <FormSelect
              value={title}
              onValueChange={handleTitleChange}
              placeholder="Select your professional title"
              className="border-input h-12 w-full rounded-lg"
              open={isTitleSelectOpen}
              onOpenChange={setIsTitleSelectOpen}
            >
              <div className="py-1">
                {PROFESSIONAL_TITLES.map((item) => (
                  <SelectItem
                    key={item}
                    value={item.split(" ")[0]}
                    className="cursor-pointer"
                  >
                    {item}
                  </SelectItem>
                ))}
              </div>
            </FormSelect>
          </div>

          <div className="space-y-2">
            <Label>
              Full Name<span className="text-destructive">*</span>
            </Label>
            <Input
              {...fullNameRegister}
              onChange={handleFullNameChange}
              onBlur={handleFullNameBlur}
              placeholder={SIGN_UP_TEXTS.createAccount.fullNamePlaceholder}
              className={`h-12 text-lg transition-all duration-200 ${
                errors?.fullName
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : "border-input focus-visible:ring-primary/30"
              }`}
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect="on"
              spellCheck="true"
              maxLength={100}
              minLength={3}
              required
              autoSave="on"
            />
            {fullName && title && (
              <p className="text-muted-foreground animate-in fade-in mt-2 text-center text-sm font-medium">
                {SIGN_UP_TEXTS.createAccount.youAre}{" "}
                <span className="text-primary font-bold">
                  {title} {fullName}
                </span>
              </p>
            )}
            {errors?.fullName && (
              <p className="text-destructive pl-1 text-sm font-medium">
                {errors.fullName.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Password<span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={SIGN_UP_TEXTS.createAccount.passwordPlaceholder}
                className={`h-12 pr-16 pl-4 text-lg transition-all duration-200 ${
                  errors?.password &&
                  "border-destructive focus-visible:ring-destructive/30"
                }`}
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                variant="ghost"
                size="sm"
              >
                {showPassword ? (
                  <span className="text-xs font-semibold">HIDE</span>
                ) : (
                  <span className="text-xs font-semibold">SHOW</span>
                )}
              </Button>
            </div>
            {password && <PasswordStrengthIndicator password={password} />}
            {errors?.password && (
              <p className="text-destructive pl-1 text-sm font-medium">
                {errors.password.message as string}
              </p>
            )}
          </div>
        </div>

        <ApiErrorNote
          error={apiError.error}
          secondsLeft={apiError.secondsLeft}
        />

        {/* Terms & Conditions */}
        <div className="mt-4 flex items-center justify-center space-x-3">
          <Checkbox
            checked={agreedToTerms}
            onCheckedChange={(checked) =>
              onAgreedToTermsChange(checked === true)
            }
            className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground h-5 w-5 border-2"
          />
          <p className="text-muted-foreground text-sm font-medium">
            {SIGN_UP_TEXTS.createAccount.agreeTo}{" "}
            <Link
              href={ROUTES.public.landing}
              className="text-primary transition-colors hover:underline"
            >
              {SIGN_UP_TEXTS.createAccount.terms}
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default CreateAccount;
