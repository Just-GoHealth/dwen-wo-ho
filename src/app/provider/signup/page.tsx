/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import JustGoHealth from "@/components/logo-purple";
import { ROUTES } from "@/constants/routes";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormInput } from "@/components/ui/form-input";
import { DevTool } from "@hookform/devtools";
import Stepper from "@/components/stepper";
import { signUpSteps } from "@/lib/utils";
import { FormSelect } from "@/components/ui/form-select";
import { SelectItem } from "@/components/ui/select";
import { ChevronUp } from "lucide-react";
import { api } from "@/lib/api";
import LoadingOverlay from "@/components/ui/loading-overlay";

const professionalTitles = [
  { value: "Dr.", label: "Dr. (Doctor)" },
  { value: "Prof.", label: "Prof. (Professor)" },
  { value: "Mr.", label: "Mr." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Ms.", label: "Ms." },
  { value: "Miss", label: "Miss" },
  { value: "Rev.", label: "Rev. (Reverend)" },
];

const SignUpSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  title: z.string().min(1, { message: "Please select your title" }),
  fullName: z.string().min(1, { message: "Please enter full name" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const SignUpContent = () => {
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { loginMutation } = useAuthQuery();
  const email = useGetSearchParams("email");
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailInput(value);
    setIsValidEmail(emailRegex.test(value));
  };

  // Remove the redirect logic - allow direct access to signup page
  // useEffect(() => {
  //   if (!email) {
  //     router.push(ROUTES.provider.checkEmail);
  //   }
  // }, [email]);

  const {
    control,
    getValues,
    setValue,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: email || "",
      title: "",
      fullName: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    if (!agreedToTerms) {
      setErrorMessage("Please agree to Terms & Conditions");
      return;
    }

    // Use the email from URL parameter or from input
    const finalEmail = email || emailInput;
    if (!finalEmail || !emailRegex.test(finalEmail)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Store form data in cookies for later use
      const formData = {
        email: finalEmail,
        fullName: values.fullName,
        professionalTitle: values.title,
        password: values.password,
      };

      // Store in cookies (secure, httpOnly cookies would be better but for now using document.cookie)
      document.cookie = `signupData=${JSON.stringify(
        formData
      )}; path=/; max-age=3600`; // 1 hour expiry

      const response = await api.createAccount({
        email: finalEmail,
        fullName: values.fullName,
        professionalTitle: values.title,
        password: values.password,
      });

      if (response.success) {
        router.push(
          `${ROUTES.provider.signUp}/${encodeURIComponent(finalEmail)}`
        );
      } else {
        setErrorMessage(response.message || "Account creation failed");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Account creation failed. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setValue("title", title);
  };

  return (
    <>
      <LoadingOverlay text="Creating your account..." isVisible={isLoading} />
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between w-full px-6 ">
          <JustGoHealth />
          <p className="text-sm font-medium text-gray-600">
            for <span className="text-purple-600 font-semibold">Providers</span>
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-6">
          <form
            id="login-form"
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
                value={email || emailInput}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                disabled={!!email}
                className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  email
                    ? "bg-gray-50 text-gray-500 border-gray-300"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              />

              <FormSelect
                value={watch("title")}
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
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
                {watch("fullName") && watch("title") && (
                  <p className="text-center text-purple-600 text-sm font-medium">
                    You are {`${getValues("title")} ${getValues("fullName")}`}
                  </p>
                )}
              </div>

              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (6 or more characters)"
                  className="w-full px-4 py-3 pr-16 text-base border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
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
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked === true)
                }
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
        </div>
        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row border-t border-gray-500 px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 items-center justify-between space-y-4 sm:space-y-0">
          <Button
            onClick={() => router.back()}
            className="rounded-full px-3 sm:px-4 border-2 sm:border-4 bg-white text-[#955aa4] text-sm sm:text-base lg:text-lg font-bold border-[#955aa4] uppercase w-full sm:w-auto"
          >
            Back
          </Button>
          <Stepper steps={signUpSteps} step="Create" />
          <button
            form="login-form"
            type="submit"
            disabled={
              !agreedToTerms ||
              (!email && !isValidEmail) ||
              !watch("password") ||
              watch("password").length < 6 ||
              isLoading
            }
            className={`text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-2 border-2 sm:border-4 font-bold rounded-md w-full sm:w-auto transition-colors ${
              agreedToTerms &&
              (email || isValidEmail) &&
              watch("password") &&
              watch("password").length >= 6
                ? "border-purple-600 text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                : "border-gray-400 text-gray-400 bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Creating..." : "Next"}
          </button>
        </div>

        <DevTool control={control} />
      </div>
    </>
  );
};

const SignUp = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
};

export default SignUp;
