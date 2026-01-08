"use client";

import { useRouter } from "next/navigation";
import { CuratorSidebar } from "@/components/curator/ui/sidebar";
import { ROUTES } from "@/constants/routes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("curatorToken");
    router.push(ROUTES.provider.auth);
  };

  const handleCreateClick = () => {
    // You can handle the create modal state here if needed
    // or pass it down to children through context if multiple children need it
  };

  return (
    <div className="h-screen bg-white flex">
      <CuratorSidebar
        schoolCount={6} // These could come from an API call or context
        providerCount={6}
        onCreateClick={handleCreateClick}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-0">
        {children}
      </div>
    </div>
  );
}
