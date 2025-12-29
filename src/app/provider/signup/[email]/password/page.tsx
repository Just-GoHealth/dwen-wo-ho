/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import JustGoHealth from "@/components/logo-purple";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { signUpSteps } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import Stepper from "@/components/stepper";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const PasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof PasswordSchema>;

const PasswordSetup = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [signupData, setSignupData] = useState<any>(null);

  const params = useParams();
  const { email } = params;
  const router = useRouter();
  const { signupMutation } = useAuthQuery();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const data = localStorage.getItem("signupData");
    if (data) {
      setSignupData(JSON.parse(data));
    }
  }, []);

  const onSubmit = async (values: PasswordFormData) => {
    if (!signupData) {
      setErrorMessage("Signup data not found. Please start over.");
      return;
    }

    setErrorMessage("");

    try {
      // Complete the account creation with password
      const response = await signupMutation.mutateAsync({
        email: signupData.email,
        password: values.password,
        fullName: signupData.fullName,
        professionalTitle: signupData.professionalTitle,
      });

      if (response.success) {
        localStorage.removeItem("signupData");

        // Store the token for future API calls
        if (response.data?.token) {
          localStorage.setItem('authToken', response.data.token);
        }

        router.push(`${ROUTES.provider.signUp}/${email}/profile`);
      } else {
        setErrorMessage(response.message || "Account creation failed");
      }
    } catch (error: any) {
      const errorMsg = (error as any)?.response?.data?.message || "Account creation failed. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center px-8 justify-between w-full">
        <JustGoHealth />
        <p className="font-bold">
          for <span className="text-4xl">Providers</span>
        </p>
      </div>

      <form id="password-form" onSubmit={handleSubmit(onSubmit)} className="px-12">
        <h1 className="text-5xl font-extrabold">Set Your Password</h1>
        <div className="my-16 space-y-5">
          <div className="relative flex flex-col">
            <label className="text-2xl font-bold text-gray-500 pl-4 mb-2">
              Password
            </label>
            <input
              {...register("password")}
              placeholder="Enter your password (6 or more characters)"
              type={showPassword ? "text" : "password"}
              className={`font-bold w-full rounded-xl border-4 ${errors?.password?.message ? "border-red-500" : "border-green-600"
                } text-2xl text-gray-500 p-4 bg-gray-200/50`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-10 right-4 transform -translate-y-1/2"
            >
              {!showPassword ? <span>SHOW</span> : <span>HIDE</span>}
            </button>
            {errors?.password?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="relative flex flex-col">
            <label className="text-2xl font-bold text-gray-500 pl-4 mb-2">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              className={`font-bold w-full rounded-xl border-4 ${errors?.confirmPassword?.message ? "border-red-500" : "border-green-600"
                } text-2xl text-gray-500 p-4 bg-gray-200/50`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-10 right-4 transform -translate-y-1/2"
            >
              {!showConfirmPassword ? <span>SHOW</span> : <span>HIDE</span>}
            </button>
            {errors?.confirmPassword?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-center font-medium">{errorMessage}</p>
          </div>
        )}
      </form>

      <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
        <Button
          onClick={() => router.back()}
          className="rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase"
        >
          Back
        </Button>
        <Stepper steps={signUpSteps} step="Profile" />
        <button
          form="password-form"
          type="submit"
          disabled={!password || !confirmPassword || signupMutation.isPending}
          className={`text-xl px-6 py-2 border-4 font-bold rounded-md flex items-center gap-2 ${password && confirmPassword && !signupMutation.isPending
            ? "border-[#955aa4] text-white bg-[#955aa4] hover:bg-[#955aa4]/80"
            : "border-gray-400 text-gray-400 bg-gray-300 cursor-not-allowed"
            }`}
        >
          {signupMutation.isPending && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {signupMutation.isPending ? "Setting Password..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default PasswordSetup;
