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
  onNext: (data: { email: string; fullName: string; title: string }) => void;
}

const CreateAccount = ({
  email: propEmail,
  fullName: propFullName,
  title: propTitle,
  onNext,
}: CreateAccountProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
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

    try {
      const response = await signupMutation.mutateAsync({
        email: values.email,
        fullName: values.fullName,
        professionalTitle: values.title,
        password: values.password,
      });

      if (response.success) {
        // Move to verification step
        onNext({
          email: values.email,
          fullName: values.fullName,
          title: values.title,
        });
      } else {
        setErrorMessage(response.message || "Account creation failed");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Account creation failed. Please try again.";
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
  const password = watch("password");

  return (
    <>
      <LoadingOverlay
        text="Creating your account..."
        isVisible={signupMutation.isPending}
      />
      <form
        id="create-account-form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto space-y-8"
      >
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join thousands of healthcare providers making a difference
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <input
            {...register("email")}
            value={email}
            placeholder="Enter your email address"
            disabled={!!propEmail}
            className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              propEmail || errors?.email
                ? "bg-gray-50 text-gray-500 border-gray-300"
                : email
                ? "border-green-600 text-green-600"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          />

          <FormSelect
            value={title}
            onValueChange={handleTitleChange}
            placeholder="Professional Title"
            className="!w-full !px-4 !py-3 !text-base !border-2 !border-gray-300 !rounded-lg !bg-white hover:!border-gray-400 focus:!outline-none focus:!ring-2 focus:!ring-purple-500 focus:!border-transparent !transition-colors !font-normal !text-gray-900 !h-auto !p-4"
          >
            <div className="py-1">
              <SelectItem
                value="Dr."
                className="px-4 py-3 text-sm font-medium hover:bg-purple-50 focus:bg-purple-50 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
              >
                Dr. (Doctor)
              </SelectItem>
              <SelectItem
                value="Prof."
                className="px-4 py-3 text-sm font-medium hover:bg-purple-50 focus:bg-purple-50 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
              >
                Prof. (Professor)
              </SelectItem>
              <SelectItem
                value="Mr."
                className="px-4 py-3 text-sm font-medium hover:bg-purple-50 focus:bg-purple-50 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
              >
                Mr.
              </SelectItem>
              <SelectItem
                value="Mrs."
                className="px-4 py-3 text-sm font-medium hover:bg-purple-50 focus:bg-purple-50 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
              >
                Mrs.
              </SelectItem>
              <SelectItem
                value="Ms."
                className="px-4 py-3 text-sm font-medium hover:bg-purple-50 focus:bg-purple-50 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
              >
                Ms.
              </SelectItem>
              <SelectItem
                value="Miss"
                className="px-4 py-3 text-sm font-medium hover:bg-purple-50 focus:bg-purple-50 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
              >
                Miss
              </SelectItem>
              <SelectItem
                value="Rev."
                className="px-4 py-3 text-sm font-medium hover:bg-purple-50 focus:bg-purple-50 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
              >
                Rev. (Reverend)
              </SelectItem>
            </div>
          </FormSelect>

          <div className="space-y-2">
            <input
              {...register("fullName")}
              placeholder="Full Name"
              className={`w-full px-4 py-3 text-base border-2 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                errors?.fullName
                  ? "border-red-500 text-red-500"
                  : fullName
                  ? "border-green-600 text-green-600"
                  : "border-gray-300"
              }`}
            />
            {fullName && title && (
              <p className="text-center text-purple-600 text-sm font-medium">
                You are {`${title} ${fullName}`}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password (6 or more characters)"
              className={`w-full px-4 py-3 pr-16 text-base border-2 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                errors?.password
                  ? "border-red-500 text-red-500"
                  : password && password.length >= 6
                  ? "border-green-600 text-green-600"
                  : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 font-medium text-xs hover:text-purple-700 transition-colors"
            >
              {showPassword ? "HIDE" : "SHOW"}
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
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            className="rounded border-2 border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
          />
          <p className="text-sm text-gray-600">
            I agree to the{" "}
            <Link
              href="/"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Terms & Conditions
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default CreateAccount;
