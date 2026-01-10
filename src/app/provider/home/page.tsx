"use client";

import JustGoHealth from "@/components/logo-purple";
import PendingVerificationModal from "@/components/modals/pending-verification";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { calculateTimeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";

const ProviderHomePage = () => {
    const [showPendingModal, setShowPendingModal] = useState(false);

    // Reuse the user query logic to get status
    const { getProfileQuery } = useUserQuery({
        refetchInterval: showPendingModal ? 5000 : undefined,
    });

    const [userInfo, setUserInfo] = useState({
        name: "Provider",
        title: "Health Provider",
        specialty: "",
        timeAgo: "Recently",
        profileImage: undefined as string | undefined,
    });

    useEffect(() => {
        if (getProfileQuery.data) {
            const data = getProfileQuery.data;

            const isPending =
                data.applicationStatus === "PENDING" ||
                (data as any).isVerified === false;

            if (isPending) {
                setUserInfo({
                    name: `${(data as any).title ? `${(data as any).title} ` : ""}${data.providerName || "Provider"}`,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    title: (data as any).professionalTitle || data.specialty || "Health Provider",
                    specialty: data.specialty || "",
                    profileImage: data.profilePhotoURL,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    timeAgo: (data as any).applicationDate ? calculateTimeAgo((data as any).applicationDate) : "Recently",
                });
                setShowPendingModal(true);
            } else {
                setShowPendingModal(false);
            }
        }
    }, [getProfileQuery.data]);


    return (
        <>
            <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
                <div className="text-center space-y-6 max-w-2xl px-6">
                    <div className="flex justify-center mb-8">
                        <JustGoHealth />
                    </div>

                    <h1 className="text-5xl font-extrabold text-[#955aa4] tracking-tight">
                        Coming Soon
                    </h1>

                    <p className="text-xl text-gray-600 font-medium leading-relaxed">
                        We are working hard to build your provider dashboard. <br />
                        Stay tuned for updates!
                    </p>

                    <div className="w-24 h-1 bg-[#2bb673] mx-auto rounded-full my-8"></div>
                </div>
            </main>

            <PendingVerificationModal
                isOpen={showPendingModal}
                isLoading={getProfileQuery.isLoading}
                onClose={() => {
                    // Prevent closing to enforce pending state view
                }}
                userInfo={userInfo}
            />
        </>
    );
};

export default ProviderHomePage;
