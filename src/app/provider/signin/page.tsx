/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import JustGoHealth from "@/components/logo-purple";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useEffect, useState, Suspense } from "react";
import { ROUTES } from "@/constants/routes";
import { ENDPOINTS } from "@/constants/endpoints";
import { api } from "@/lib/api";
import PendingVerificationModal from "@/components/modals/pending-verification";

const LoginSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  password: z.string().min(1, { message: "Please enter password" }),
});

const SignInContent = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Dr. Amanda Gorman",
    title: "Clinical Psychologist",
    timeAgo: "2 hours ago",
  });
  const { loginMutation } = useAuthQuery();
  const router = useRouter();

  const email = useGetSearchParams("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email,
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    console.log("=== SIGN IN STARTED ===");
    console.log("Email:", values.email);

    try {
      console.log("📧 Attempting sign in...");
      const response = await api(ENDPOINTS.login, {
        method: "POST",
        body: JSON.stringify(values),
      });

      console.log("✅ Sign in response:", response);

      if (response?.success) {
        console.log("✅ Sign in successful, processing response...");
        console.log("📦 Response data:", response?.data);

        // Store token if needed
        if (response?.data?.token) {
          console.log("🔑 Token received, storing in localStorage");
          localStorage.setItem("token", response?.data?.token);
        } else {
          console.log("⚠️ No token in response");
        }

        // Check for pending status (comprehensive check)
        const userData = response?.data;
        const isPending =
          userData?.applicationStatus === "PENDING" ||
          userData?.status === "PENDING" ||
          userData?.isVerified === false ||
          response?.message === "ACCOUNT PENDING";

        console.log("🔍 Pending check:", {
          applicationStatus: userData?.applicationStatus,
          status: userData?.status,
          isVerified: userData?.isVerified,
          message: response?.message,
          isPending: isPending
        });

        if (isPending) {
          console.log("⚠️ User is PENDING, saving to localStorage and redirecting...");
          const userDataStr = JSON.stringify(userData);
          console.log("💾 Saving pendingUser:", userDataStr);
          localStorage.setItem("pendingUser", userDataStr);

          // Verify it was saved
          const savedData = localStorage.getItem("pendingUser");
          console.log("✓ Verified pendingUser saved:", !!savedData);

          console.log("🔄 Redirecting to:", ROUTES.provider.home);
          router.push(ROUTES.provider.home);
        } else {
          console.log("✅ User is APPROVED, redirecting to home");
          router.push(ROUTES.provider.home);
        }
      } else {
        console.error("❌ Sign in failed:", response?.message);
        setErrorMessage(response?.message ?? "Sign in failed");
      }
    } catch (error: any) {
      console.error("❌ Sign in error:", error);
      console.error("Error message:", error.message);

      const errorMsg = error.message || "Sign in failed. Please try again.";

      // Check if error is about incomplete profile
      if (error.message && error.message.includes("Profile is not complete")) {
        console.log("⚠️ Profile incomplete, redirecting to profile completion");

        // Store user email for profile completion
        localStorage.setItem("profileCompletionEmail", values.email);

        // Determine which step to redirect to
        if (error.message.includes("upload your profile photo")) {
          console.log("→ Redirecting to photo step");
          router.push(`/provider/signup?email=${encodeURIComponent(values.email)}&step=photo`);
        } else if (error.message.includes("office phone number")) {
          console.log("→ Redirecting to bio step");
          router.push(`/provider/signup?email=${encodeURIComponent(values.email)}&step=bio`);
        } else if (error.message.includes("add your specialty")) {
          console.log("→ Redirecting to specialty step");
          router.push(`/provider/signup?email=${encodeURIComponent(values.email)}&step=specialty`);
        } else {
          // Default to photo step
          console.log("→ Redirecting to photo step (default)");
          router.push(`/provider/signup?email=${encodeURIComponent(values.email)}&step=photo`);
        }
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (!email) {
      router.push(ROUTES.provider.checkEmail);
    }
  }, [email, router]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-6">
        <JustGoHealth />
        <button className="bg-gray-300 text-red-500 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-400 transition-colors">
          Switch to Patients
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <form
          id="login-form"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md mx-auto space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sign in to your Account
            </h1>
            <p className="text-gray-600">
              Welcome back! Please sign in to continue.
            </p>
          </div>
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              {...register("email")}
              value={email as string}
              placeholder={email as string}
              disabled
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg text-gray-500 bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-3 pr-16 text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors?.password?.message
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 font-medium text-sm hover:text-purple-700 transition-colors"
              >
                {!showPassword ? "SHOW" : "HIDE"}
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

          {/* Forgot Password Link */}
          <div className="text-center">
            <Link
              href={`${ROUTES.provider.verifyPasswordReset}?email=${email}`}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
            >
              Don&apos;t remember your password? Recover account →
            </Link>
          </div>
        </form>
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row border-t border-gray-500 px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-10 items-center justify-between space-y-4 sm:space-y-0">
        <Button
          onClick={() => router.back()}
          className="rounded-full px-3 sm:px-4 lg:px-6 border-2 sm:border-4 bg-white text-[#955aa4] text-sm sm:text-base lg:text-xl font-bold border-[#955aa4] uppercase w-full sm:w-auto"
        >
          Back
        </Button>
        <button
          form="login-form"
          type="submit"
          disabled={!password.trim() || isLoading}
          className={`text-sm sm:text-base lg:text-xl px-3 sm:px-4 lg:px-6 py-2 border-2 sm:border-4 font-bold rounded-md flex items-center gap-2 w-full sm:w-auto ${!password.trim() || isLoading
            ? "border-gray-400 text-gray-400 bg-gray-300 cursor-not-allowed"
            : "border-[#2b3990] text-white bg-[#955aa4] hover:bg-[#955aa4]/80"
            }`}
        >
          {isLoading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </div>

      {/* Pending Verification Modal */}
      <PendingVerificationModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        userInfo={userInfo}
      />
    </div>
  );
};

const SignIn = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
};

export default SignIn;
