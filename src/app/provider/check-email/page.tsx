"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import CheckEmail from "@/components/provider/ui/check-email";

const CheckEmailPage = () => {
  const router = useRouter();

  const handleEmailSubmit = (email: string, emailExists: boolean) => {
    if (emailExists) {
      router.push(
        `${ROUTES.provider.singIn}?email=${encodeURIComponent(email)}`
      );
    } else {
      router.push(
        `${ROUTES.provider.signUp}?email=${encodeURIComponent(email)}`
      );
    }
  };

  return <CheckEmail onEmailSubmit={handleEmailSubmit} />;
};

export default CheckEmailPage;
