"use client";

import JustGoHealth from "@/components/logo-purple";
import PendingVerificationModal from "@/components/modals/pending-verification";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { calculateTimeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const ProviderHomePage = () => {
    const router = useRouter();
    const [showPendingModal, setShowPendingModal] = useState(false);

    const [hasToken, setHasToken] = useState(false);

    // Reuse the user query logic to get status
    const { getProfileQuery } = useUserQuery({
        refetchInterval: showPendingModal ? 5000 : undefined,
        enabled: hasToken,
    });

    const [userInfo, setUserInfo] = useState({
        name: "Provider",
        title: "Health Provider",
        specialty: "",
        timeAgo: "Recently",
        profileImage: undefined as string | undefined,
    });

    // Protect route and handle pending state from LocalStorage (Fallback)
    useEffect(() => {
        console.log("🏠 HOME PAGE: useEffect triggered");
        const token = localStorage.getItem("token");
        const pendingUserStr = localStorage.getItem("pendingUser");

        console.log("🏠 HOME PAGE: Token exists?", !!token);
        console.log("🏠 HOME PAGE: PendingUser exists?", !!pendingUserStr);
        console.log("🏠 HOME PAGE: PendingUser data:", pendingUserStr);

        if (!token && !pendingUserStr) {
            console.log("🏠 HOME PAGE: No token AND no pendingUser - REDIRECTING to auth");
            router.push(`${ROUTES.provider.auth}?step=sign-in`);
            return;
        }

        if (token) {
            console.log("🏠 HOME PAGE: Token found, enabling user query");
            setHasToken(true);
        }

        // If local storage has pending user data, use it to show modal immediately
        if (pendingUserStr) {
            console.log("🏠 HOME PAGE: Found pending user data, parsing...");
            try {
                const pendingData = JSON.parse(pendingUserStr);
                console.log("🏠 HOME PAGE: Parsed pending data:", pendingData);

                const isPending =
                    pendingData.applicationStatus === "PENDING" ||
                    pendingData.status === "PENDING" ||
                    pendingData.isVerified === false;

                console.log("🏠 HOME PAGE: isPending check result:", isPending);

                if (isPending) {
                    console.log("🏠 HOME PAGE: User is pending, showing modal");
                    setUserInfo({
                        name: `${pendingData.title ? `${pendingData.title} ` : ""}${pendingData.providerName || pendingData.fullName || "Provider"}`,
                        title: pendingData.professionalTitle || pendingData.specialty || "Health Provider",
                        specialty: pendingData.specialty || "",
                        profileImage: pendingData.profilePhotoURL || pendingData.profileURL,
                        timeAgo: pendingData.applicationTimestamp ? calculateTimeAgo(pendingData.applicationTimestamp) : "Recently",
                    });
                    setShowPendingModal(true);
                } else {
                    console.log("🏠 HOME PAGE: User data exists but not pending");
                }
            } catch (e) {
                console.error("🏠 HOME PAGE: Failed to parse pending user data", e);
            }
        }
    }, [router]);

    // Update with real data from API if available
    useEffect(() => {
        if (getProfileQuery.data) {
            const data = getProfileQuery.data;

            const isPending =
                data.applicationStatus === "PENDING" ||
                data.status === "PENDING" ||
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
                // If verified/approved, clear the pending fallback
                localStorage.removeItem("pendingUser");

                // Check for incomplete profile logic (mirrors signin.tsx)
                const email = data.email || ""; // Ensure we have an email if possible
                const emailParams = email ? `email=${encodeURIComponent(email)}&` : "";

                if (!data.profilePhotoURL && !data.profileURL) {
                    router.push(`/provider/signup?${emailParams}step=photo`);
                    return;
                }

                if (!data.officePhoneNumber && !data.phoneNumber) {
                    router.push(`/provider/signup?${emailParams}step=bio`);
                    return;
                }

                if ((!data.specialty || !data.specialty.trim()) && (!data.professionalTitle || !data.professionalTitle.trim())) {
                    // Note: Checking specific fields. Adjust based on exact API response keys.
                    // Assuming 'specialty' is the key.
                    router.push(`/provider/signup?${emailParams}step=specialty`);
                    return;
                }
            }
        }
    }, [getProfileQuery.data, router]);


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
                isLoading={getProfileQuery.isLoading && !showPendingModal} // Only show loading if modal isn't already shown via fallback
                onClose={() => {
                    // Prevent closing to enforce pending state view
                }}
                userInfo={userInfo}
            />
        </>
    );
};

export default ProviderHomePage;
