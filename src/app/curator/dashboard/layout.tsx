"use client";

import { useRouter } from "next/navigation";
import { CuratorSidebar } from "@/components/curator/ui/sidebar";
import { ROUTES } from "@/constants/routes";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const curatorToken = localStorage.getItem("curatorToken");
      return !!(token || curatorToken);
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const curatorToken = localStorage.getItem("curatorToken");
      
      if (!token && !curatorToken) {
        router.replace(ROUTES.provider.auth);
        setIsAuthenticated(false);
        return;
      }
      
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("curatorToken");
    router.push(ROUTES.provider.auth);
  };

  const handleCreateClick = () => {
  };

  if (isAuthenticated === null) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  return (
    <div className="h-screen bg-white flex">
      <CuratorSidebar
        schoolCount={6}
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
