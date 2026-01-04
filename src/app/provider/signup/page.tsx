"use client";

import Layout from "@/app/provider/auth/layout";
import ProviderSignUp from "@/components/provider/ui/sign-up";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const SignUpPageContent = () => {
  const name = useGetSearchParams("name");
  const title = useGetSearchParams("title");
  const specialty = useGetSearchParams("specialty");
  const photo = useGetSearchParams("photo");
  const pending = useGetSearchParams("pending");
  const email = useGetSearchParams("email");
  const step = useGetSearchParams("step");
  const router = useRouter();

  // Map step names to profile step numbers
  const getProfileStep = () => {
    if (step === "photo") return 0;
    if (step === "bio") return 1;
    if (step === "specialty") return 2;
    // If pending, default to profile view (usually effectively step 2 or just rendering the modal over it)
    if (pending === "true") return 2;
    return null;
  };

  return (
    <ProviderSignUp
      email={email ?? undefined}
      fullName={name ?? undefined}
      title={title ?? undefined}
      specialty={specialty ?? undefined}
      profileImage={photo ?? undefined}
      isPending={pending === "true"}
      profileStep={getProfileStep()}
      onBack={() => router.back()}
    />
  );
};

const SignUpPage = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpPageContent />
      </Suspense>
    </Layout>
  );
};

export default SignUpPage;
