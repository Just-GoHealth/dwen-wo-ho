"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const CuratorDashboard = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const curatorToken = localStorage.getItem("curatorToken");
      
      if (token || curatorToken) {
        router.replace(ROUTES.curator.schools);
      } else {
        router.replace(ROUTES.provider.auth);
      }
      return false;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined" && isChecking) {
      const token = localStorage.getItem("token");
      const curatorToken = localStorage.getItem("curatorToken");
      
      if (token || curatorToken) {
        router.replace(ROUTES.curator.schools);
      } else {
        router.replace(ROUTES.provider.auth);
      }
      setIsChecking(false);
    }
  }, [router, isChecking]);

  if (isChecking) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default CuratorDashboard;


