/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import JustGoHealth from "@/components/logo-purple";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState, Suspense } from "react";
import { ROUTES } from "@/constants/routes";
import { ENDPOINTS } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/useSelectedValuesFromReactHookForm";
import {
  CuratorLoginSchema,
  CuratorLoginFormData,
} from "@/schemas/curator.auth.schema";

interface CuratorSignInProps {
  email: string;
  onBack: () => void;
}

const CuratorSignInContent = ({ email, onBack }: CuratorSignInProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const { register, handleSubmit, errors, watch } =
    useSelectedValuesFromReactHookForm(CuratorLoginSchema, {
      mode: "onChange",
      defaultValues: {
        email,
        password: "",
      },
    });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: CuratorLoginFormData) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await api(ENDPOINTS.curatorSignIn, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (response.success) {
        // Store curator token
        if (response.data?.token) {
          localStorage.setItem("curatorToken", response.data.token);
        }
        router.push(ROUTES.curator.dashboard);
      } else {
        setErrorMessage(response.message || "Sign in failed");
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMsg =
        (error as any)?.response?.data?.message || "Sign in failed. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch password field for real-time validation
  const password = watch("password");

  useEffect(() => {
    if (!email) {
      onBack();
    }
  }, [email, onBack]);

  return (
    <div className="min-h-screen bg-[red]h-full flex flex-col py-8 justify-between">
      <div className="flex items-center px-8 justify-between w-full">
        <JustGoHealth />
        <button className="bg-gray-300 text-red-500 rounded-full px-4 py-1">
          Switch to Providers
        </button>
      </div>

      <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="px-12">
        <h1 className="text-5xl font-extrabold">Curator Sign In</h1>
        <div className="my-16">
          <div className="flex flex-col">
            <label className="text-2xl font-bold text-gray-500 pl-4">
              Email
            </label>
            <input
              {...register("email")}
              value={email as string}
              placeholder={email as string}
              disabled
              className={`font-bold w-full rounded-xl border-gray-300 border-4 text-2xl text-gray-500 p-4 bg-gray-200/50`}
            />
          </div>
          <div className="mt-4 flex flex-col">
            <label className="text-2xl font-bold text-gray-500 pl-4">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                placeholder="********"
                type={showPassword ? "text" : "password"}
                className={`font-bold w-full rounded-xl border-4 ${errors?.password
                  ? "border-red-500 text-red-500"
                  : password?.length > 0
                    ? "border-green-600 text-green-600"
                    : "border-gray-300 text-gray-500"
                  } text-2xl text-gray-500 p-4 bg-gray-200/50`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-0.5 transform -translate-x-1/2 -translate-y-1/2"
              >
                {!showPassword ? <span>SHOW</span> : <span>HIDE</span>}
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-center font-medium">
              {errorMessage}
            </p>
          </div>
        )}
      </form>

      <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
        <Button
          onClick={onBack}
          className="rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase"
        >
          Back
        </Button>
        <button
          form="login-form"
          type="submit"
          disabled={
            !password?.length || isSubmitting || Object.keys(errors).length > 0
          }
          className={`text-xl px-6 py-2 border-4 font-bold rounded-md flex items-center gap-2 ${!password?.length || isSubmitting || Object.keys(errors).length > 0
              ? "border-gray-400 text-gray-400 bg-gray-300 cursor-not-allowed"
              : "border-[#2b3990] text-white bg-[#955aa4] hover:bg-[#955aa4]/80"
            }`}
        >
          {isSubmitting && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <div
                className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-1 h-1 border-2 border-white border-t-transparent rounded-full animate-spin"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          )}
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </div>
    </div>
  );
};

const CuratorSignIn = (props: CuratorSignInProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CuratorSignInContent {...props} />
    </Suspense>
  );
};

export default CuratorSignIn;
