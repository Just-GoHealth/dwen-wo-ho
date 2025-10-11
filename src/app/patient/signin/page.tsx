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

const LoginSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  password: z.string().min(1, { message: "Please enter password" }),
});

const SignInContent = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log(values);
    loginMutation.mutate(values, {
      onSuccess: () => {
        router.push("/signin");
      },
    });
  };

  useEffect(() => {
    if (!email) {
      router.push(ROUTES.patient.checkEmail);
    }
  }, [email, router]);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center px-8 justify-between w-full">
        <JustGoHealth />
        <p className="font-bold">
          for <span className="text-4xl">Patients</span>
        </p>
      </div>
      <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="px-12">
        <h1 className="text-5xl font-extrabold">Sign in to your Account</h1>
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
              className={`font-bold w-full rounded-xl border-4 text-2xl text-gray-500 p-4 bg-gray-200/50`}
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
                className={`font-bold w-full rounded-xl border-4 ${
                  errors?.email?.message ? "border-red-500" : "border-green-600"
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

        <h1 className="text-2xl font-bold text-center text-[#955aa4]">
          Don&apos;t remember password?{" "}
          <Link
            href={`${ROUTES.patient.verifyPasswordReset}?email=${email}`}
            className="text-[#ed1c24]"
          >
            Recover account &gt;
          </Link>
        </h1>
      </form>
      <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
        <Button
          onClick={() => router.back()}
          className="rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase"
        >
          Back
        </Button>
        <input
          form="login-form"
          type="submit"
          value={"Sign In"}
          className="text-xl px-6 py-2 border-4 font-bold border-[#955aa4] rounded-md text-white bg-[#955aa4]/50"
        />
      </div>
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
