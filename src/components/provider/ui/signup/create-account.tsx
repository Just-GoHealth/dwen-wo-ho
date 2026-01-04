/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSelect } from "@/components/ui/form-select";
import { SelectItem } from "@/components/ui/select";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/useSelectedValuesFromReactHookForm";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import {
  ProviderSignUpSchema,
  ProviderSignUpFormData,
} from "@/schemas/provider.auth.schema";

interface CreateAccountProps {
  email?: string;
  fullName?: string;
  title?: string;
  agreedToTerms: boolean;
  onAgreedToTermsChange: (agreed: boolean) => void;
  onNext: (data: { email: string; fullName: string; title: string }) => void;
}

const CreateAccount = ({
  email: propEmail,
  fullName: propFullName,
  title: propTitle,
  agreedToTerms,
  onAgreedToTermsChange,
  onNext,
}: CreateAccountProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { signupMutation } = useAuthQuery();

  const { register, handleSubmit, errors, watch, setValue } =
    useSelectedValuesFromReactHookForm(ProviderSignUpSchema, {
      mode: "onChange",
      defaultValues: {
        email: propEmail || "",
        title: propTitle || "",
        fullName: propFullName || "",
        password: "",
      },
    });

  const onSubmit = async (values: ProviderSignUpFormData) => {
    if (!agreedToTerms) {
      setErrorMessage("Please agree to Terms & Conditions");
      return;
    }

    setErrorMessage("");

    console.log("=== CREATING ACCOUNT ===");
    console.log("Email:", values.email);

    try {
      // Create Account directly
      console.log("Calling signupMutation with user details");

      const response = await signupMutation.mutateAsync({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        professionalTitle: values.title,
      });

      console.log("Signup response:", response);

      if (response.success || response) {
        console.log("✅ Account created successfully. Verification email sent.");

        // No need to store password in localStorage anymore
        // We might store email/name if needed for the next step display, 
        // but the parent component handles that via onNext arguments.

        // Move to verification step
        onNext({
          email: values.email,
          fullName: values.fullName,
          title: values.title,
        });
      } else {
        console.error("❌ Signup failed - no success flag");
        setErrorMessage(response.message || "Failed to create account");
      }
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);

      let errorMsg = "Failed to create account. Please try again.";

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
  };

  const handleTitleChange = (value: string) => {
    setValue("title", value);
  };

  // Watch fields for validation
  const email = watch("email");
  const title = watch("title");
  const fullName = watch("fullName");


  return (
    <>
      <LoadingOverlay
        text="Sending verification code..."
        isVisible={signupMutation.isPending}
      />
      <form
        id="create-account-form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl mx-auto space-y-4 px-11"
      >
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-black mb-1">
            Create Your Account
          </h1>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <input
            {...register("email")}
            value={email}
            placeholder="Enter your email address"
            disabled
            className="font-bold w-full rounded-xl text-lg text-gray-500 p-3 bg-gray-200/50 outline-none border-none"
          />

          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-black">
              Professional Title
            </h2>
            <FormSelect
              value={title}
              onValueChange={handleTitleChange}
              placeholder="Professional Title"
              className="!w-full !rounded-full !text-lg !text-gray-500 !p-3 !bg-gray-200/50 !border-2 !border-gray-400 outline-none !h-auto font-bold"
            >
              <div className="py-1">
                {[
                  "Dr. (Doctor)",
                  "Prof. (Professor)",
                  "Mr.",
                  "Mrs.",
                  "Ms.",
                  "Miss",
                  "Rev. (Reverend)",
                ].map((item) => (
                  <SelectItem
                    key={item}
                    value={item.split(" ")[0]}
                    className="px-4 py-3 text-lg font-medium text-gray-500 data-[state=checked]:bg-[#ed1c24] data-[state=checked]:text-white focus:bg-[#ed1c24] focus:text-white cursor-pointer rounded-none"
                  >
                    {item}
                  </SelectItem>
                ))}
              </div>
            </FormSelect>
          </div>

          <div className="space-y-2">
            <input
              {...register("fullName")}
              placeholder="Full Name"
              className={`font-bold w-full rounded-xl text-lg border-2 text-gray-500 p-3 bg-gray-200/50 outline-none focus:border-[#2bb673] transition-colors ${errors?.fullName ? "border-red-500" : "border-gray-400"
                }`}
            />
            {fullName && title && (
              <p className="text-center text-gray-500 text-lg font-bold mt-2">
                You are <span className="text-[#955aa4]">{title} {fullName}</span>
              </p>
            )}
          </div>

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password (6 or more characters)"
              className={`font-bold w-full rounded-xl text-lg text-gray-500 p-3 bg-gray-200/50 outline-none border-2 border-gray-400 focus:border-[#2bb673] transition-colors ${errors?.password ? "border-red-500" : "border-gray-400"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-xs uppercase hover:text-gray-700 transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-center text-sm font-medium">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Terms & Conditions */}
        <div className="flex items-center justify-center space-x-3 mt-4">
          <Checkbox
            checked={agreedToTerms}
            onCheckedChange={(checked) => onAgreedToTermsChange(checked === true)}
            className="w-6 h-6 rounded border-2 border-gray-400 data-[state=checked]:bg-transparent data-[state=checked]:text-black"
          />
          <p className="text-lg font-bold text-gray-500">
            Agree to{" "}
            <Link
              href="/"
              className="text-[#ed1c24] hover:underline transition-colors"
            >
              Terms & Conditions
            </Link>
          </p>
        </div>
      </form >
    </>
  );
};

export default CreateAccount;
