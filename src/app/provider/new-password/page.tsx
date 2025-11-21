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
import { DevTool } from "@hookform/devtools";
import { recoverSteps } from "@/lib/utils";
import Stepper from "@/components/stepper";
import { api } from "@/lib/api";

const SignUpSchema = z.object({
  email: z.email().min(1, { message: "Please enter your email" }),
  password: z.string().min(6, { message: "Please enter your password" }),
  repeatPassword: z.string().min(6, { message: "Please enter your password" }),
});

const SignUpContent = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const email = useGetSearchParams("email");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!email) {
      router.push(ROUTES.provider.checkEmail);
    }
  }, [email, router]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email,
      repeatPassword: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    console.log(values);
    try {
      const response = await api.resetPassword({
        password: values.password,
        confirmPassword: values.repeatPassword as string,
      });

      if (response.success) {
        console.log(response);
      } else {
        setErrorMessage(response.message || "The provided email is invalid");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Sign in failed. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center px-8 justify-between w-full">
        <JustGoHealth />
        <Link
          href={ROUTES.provider.singIn}
          className="text-2xl bg-gray-300 text-[#ed1c24] rounded-full px-4 py-1"
        >
          Sign in
        </Link>
      </div>
      <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="px-12">
        <h1 className="text-6xl text-center font-extrabold">
          Create New Password
        </h1>
        <div className="my-16 space-y-5">
          <div className="relative mt-4 flex flex-col">
            <input
              {...register("password")}
              placeholder="Password (6 or more characters)"
              type={showPassword ? "text" : "password"}
              className={`font-bold w-full rounded-xl border-4 ${
                errors?.email?.message ? "border-red-500" : "border-green-600"
              } text-2xl text-green-600 p-4 bg-gray-200/50`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-0.5 transform -translate-x-1/2 -translate-y-1/2"
            >
              {!showPassword ? <span>SHOW</span> : <span>HIDE</span>}
            </button>
          </div>
          <div className="relative mt-4 flex flex-col">
            <input
              {...register("repeatPassword")}
              placeholder="Repeat Password"
              type={showPassword ? "text" : "password"}
              className={`font-bold w-full rounded-xl border-4 ${
                errors?.email?.message ? "border-red-500" : "border-green-600"
              } text-2xl text-green-600 p-4 bg-gray-200/50`}
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
      </form>
      <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
        <Button
          onClick={() => router.back()}
          className="none rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase"
        >
          Back
        </Button>
        <Stepper steps={recoverSteps} step="New Password" />
        <input
          form="login-form"
          type="submit"
          value="DONE"
          className="text-xl px-7 py-1 border-4 font-bold border-[#2b3990] rounded-full text-white bg-[#955aa4]"
        />
      </div>
      <DevTool control={control} />
    </div>
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
