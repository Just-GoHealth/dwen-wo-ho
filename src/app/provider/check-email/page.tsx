/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import JustGoHealth from "@/components/logo-purple";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";

const FormSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
});

const CheckEmail = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const watchedEmail = watch("email");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(emailRegex.test(value));
  };

  const checkEmailExists = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await api.checkEmail(email);

      if (response && response.success) {
        // Check if email exists based on the API response
        if (response.data?.emailExists) {
          // Email exists, route to sign in
          router.push(
            `${ROUTES.provider.singIn}?email=${encodeURIComponent(email)}`
          );
        } else {
          // Email doesn't exist, route to sign up
          router.push(
            `${ROUTES.provider.signUp}?email=${encodeURIComponent(email)}`
          );
        }
      } else {
        // If API call fails, default to signup
        router.push(
          `${ROUTES.provider.signUp}?email=${encodeURIComponent(email)}`
        );
      }
    } catch (error) {
      console.error("Error checking email:", error);
      // If error occurs, default to signup
      router.push(
        `${ROUTES.provider.signUp}?email=${encodeURIComponent(email)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    checkEmailExists(values.email);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-6">
        <JustGoHealth />
        <Link
          href={ROUTES.patient.checkEmail}
          className="bg-gray-300 text-red-500 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-400 transition-colors"
        >
          Switch to Patients
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to JustGo Health
            </h1>
            <p className="text-gray-600">
              Enter your email to{" "}
              <span className="text-purple-600 font-semibold">Sign In</span> or{" "}
              <span className="text-purple-600 font-semibold">Sign Up</span> as
              a Provider
            </p>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 pr-16 text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors?.email?.message
                      ? "border-red-500 bg-red-50"
                      : isValidEmail
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                />
                <Button
                  type="submit"
                  disabled={!isValidEmail || isLoading}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isValidEmail && !isLoading
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Image
                      src="/arrow-vertical.png"
                      alt="Submit"
                      width={20}
                      height={20}
                      className="w-4 h-4"
                    />
                  )}
                </Button>
              </div>
            </div>
          </form>
          {/* Footer Section */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-purple-600">
              JustGo Health Providers
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              There are thousands of students out there hoping for someone like
              you. Welcome.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
