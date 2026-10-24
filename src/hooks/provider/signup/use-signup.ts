"use client";

import { useRouter } from "next/navigation";
import useGetSearchParams from "@/hooks/shared/use-get-search-params";

/** URL state for /provider/signup: `?email=&name=&title=` or `?step=profile`. */
export function useProviderSignup() {
  const router = useRouter();
  const name = useGetSearchParams("name");
  const title = useGetSearchParams("title");
  const email = useGetSearchParams("email");
  const step = useGetSearchParams("step");

  return {
    email: email ?? undefined,
    fullName: name ?? undefined,
    title: title ?? undefined,
    startOnProfile: step === "profile",
    handleBack: () => router.back(),
  };
}
