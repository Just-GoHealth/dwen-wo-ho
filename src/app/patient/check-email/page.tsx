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

const FormSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
});

const CheckEmail = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

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

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    router.push(`${ROUTES.patient.singIn}?email=${values.email}`);
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-center px-4 md:px-24">
      <div className="absolute flex top-0 items-center px-8 justify-between w-full">
        <JustGoHealth />
        <Link
          href={ROUTES.provider.checkEmail}
          className="text-2xl bg-gray-300 text-[#ed1c24] rounded-full px-4 py-1"
        >
          Switch to Provider
        </Link>
      </div>
      <div className="flex flex-col h-full items-center justify-center space-y-12 px-6">
        <h1 className="text-5xl text-center font-medium">
          Enter your email to <span className="text-[#955aa4]">Sign In</span> or{" "}
          <span className="text-[#955aa4]">Sign Up</span> as a Patient.
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col">
            <label className="text-4xl font-bold text-gray-500 pl-4">
              Email
            </label>
            <div className="relative flex">
              <input
                {...register("email")}
                onChange={handleEmailChange}
                placeholder="example@gmail.com"
                className={`font-bold w-full rounded-l-xl border-4 border-r-0 ${
                  errors?.email?.message ? "border-red-500" : "border-green-600"
                } text-2xl text-gray-500 p-4 bg-gray-200/50 focus:outline-none`}
              />
              <Button
                type="submit"
                variant="ghost"
                disabled={!isValidEmail}
                className={`rounded-l-none rounded-r-xl border-4 border-l-0 px-4 h-auto ${
                  isValidEmail 
                    ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                    : "bg-gray-400 text-gray-200 border-gray-400 cursor-not-allowed"
                }`}
              >
                <Image 
                  src="/arrow-right.svg" 
                  alt="Arrow right" 
                  width={32} 
                  height={32}
                  className="w-8 h-8"
                />
              </Button>
            </div>
          </div>
        </form>
        <div>
          <h1 className="text-5xl font-bold text-center text-[#955aa4]">
            JustGo Health Patients
          </h1>
          <h2 className="mt-4 text-2xl font-medium text-center">
            Great doctors, psychologists, and mentors are ready to guide you
            personally. Hurry up!
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
