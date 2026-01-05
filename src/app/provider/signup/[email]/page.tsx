/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ProviderSignUp from "@/components/provider/ui/sign-up";

const SignupPageContent = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = decodeURIComponent(params.email as string);

  // Get query params
  const stepParam = searchParams.get("step");
  const isPending = searchParams.get("pending") === "true";
  const title = searchParams.get("title") || "Dr.";
  const fullName = searchParams.get("name") || "";
  const specialty = searchParams.get("specialty") || "";
  const profileImage = searchParams.get("photo") || undefined;

  // Map step string to number
  let profileStep: number | null = null;
  if (stepParam === "photo") profileStep = 0;
  else if (stepParam === "bio") profileStep = 1;
  else if (stepParam === "specialty") profileStep = 2;

  const handleBack = () => {
    router.back();
  };

  return (
    <ProviderSignUp
      email={email}
      fullName={fullName}
      title={title}
      specialty={specialty}
      profileImage={profileImage}
      isPending={isPending}
      profileStep={profileStep}
      onBack={handleBack}
    />
  );
};

const SignupPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPageContent />
    </Suspense>
  );
};

export default SignupPage;
