"use client";

import Layout from "@/app/provider/auth/layout";
import ProviderSignUp from "@/components/provider/ui/sign-up";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const SignUpPageContent = () => {
  const email = useGetSearchParams("email");
  const router = useRouter();

  return (
    <ProviderSignUp
      email={email ?? undefined}
      profileStep={null}
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
