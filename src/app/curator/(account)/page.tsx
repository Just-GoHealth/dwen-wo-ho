"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const CuratorDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const curatorToken = localStorage.getItem("curatorToken");
    
    if (token || curatorToken) {
      router.replace(ROUTES.curator.schools);
    } else {
      router.replace(ROUTES.provider.auth);
    }
  }, [router]);

  return null;
};

export default CuratorDashboard;


