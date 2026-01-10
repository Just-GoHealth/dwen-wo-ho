"use client";

import CheckEmail from "@/components/provider/ui/check-email";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const ProviderCheckEmailPage = () => {
    const router = useRouter();

    const handleEmailSubmit = (submittedEmail: string, emailExists: boolean) => {
        const emailParams = encodeURIComponent(submittedEmail);
        if (emailExists) {
            router.push(`${ROUTES.provider.singIn}?email=${emailParams}`);
        } else {
            router.push(`${ROUTES.provider.signUp}?email=${emailParams}`);
        }
    };

    return <CheckEmail onEmailSubmit={handleEmailSubmit} />;
};

export default ProviderCheckEmailPage;
