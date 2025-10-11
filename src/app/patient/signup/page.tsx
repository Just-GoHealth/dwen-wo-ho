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
import { DevTool } from "@hookform/devtools";
import Stepper from "@/components/stepper";
import { signUpSteps } from "@/lib/utils";

const SignUpSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  fullName: z.string().min(1, { message: "Please enter full name" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Please enter your phone number" })
    .max(10),
  password: z.string().min(1, { message: "Please enter your password" }),
});

const SignUpContent = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { loginMutation } = useAuthQuery();
  const email = useGetSearchParams("email");
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      router.push(ROUTES.patient.checkEmail);
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
      fullName: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    console.log(values);
    loginMutation.mutate(values, {
      onSuccess: () => {
        router.push("/signin");
      },
    });
    router.push(`${ROUTES.patient.verifyEmail}/${email}`)
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center px-8 justify-between w-full">
        <JustGoHealth />
        <p className="font-bold">
          for <span className="text-4xl">Patients</span>
        </p>
      </div>
      <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="px-12">
        <h1 className="text-5xl text-center font-extrabold">
          Create Your Account
        </h1>
        <div className="my-16 space-y-5">
          <input
            {...register("email")}
            value={email as string}
            placeholder={email as string}
            disabled
            className={`font-bold w-full rounded-xl border-4 text-2xl text-gray-500 p-4 bg-gray-200/50`}
          />
          <div className="flex flex-col space-y-3">
            <input
              {...register("fullName")}
              placeholder="Full Name"
              className={`font-bold w-full rounded-xl border-4 text-2xl text-gray-500 p-4 bg-gray-200/50`}
            />
          </div>
          <div className="flex flex-col space-y-3">
            <input
              {...register("phoneNumber")}
              type="tel"
              placeholder="Phone Number"
              className={`font-bold w-full rounded-xl border-4 text-2xl text-gray-500 p-4 bg-gray-200/50`}
            />
            <h2 className="ml-4 text-gray-500 text-3xl font-bold">
              This will only be used for emergencies
            </h2>
          </div>
          <div className="relative mt-4 flex flex-col">
            <input
              {...register("password")}
              placeholder="Password (6 or more characters)"
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

        <h1 className="text-2xl font-bold text-center text-gray-500">
          <Checkbox className="mr-4 rounded-none border-black" />
          Agree to{" "}
          <Link href="/" className="text-[#ed1c24]">
            Terms & Conditions
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
        <Stepper steps={signUpSteps} step="Create" />
        <input
          form="login-form"
          type="submit"
          value={"Next"}
          className="text-xl px-6 py-2 border-4 font-bold border-[#955aa4] rounded-md text-white bg-[#955aa4]/50"
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
