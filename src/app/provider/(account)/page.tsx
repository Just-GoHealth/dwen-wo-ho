"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import useProviderDashboard from "@/hooks/provider/dashboard/use-dashboard";
import { performLogout } from "@/lib/auth/session";
import { ROUTES } from "@/lib/constants/infra/routes";
import useProviderDashboardAuth from "@/hooks/provider/dashboard-auth/use-dashboard-auth";
import { ProviderHomeShell } from "@/components/provider/dashboard/provider-home-shell";
import ProviderDashboardModals from "@/components/provider/dashboard/dashboard-overlay-host";
import { toast } from "sonner";

export default function ProviderHomePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const {
    isApproved,
    isLoading: isAuthLoading,
    authProfile,
  } = useProviderDashboardAuth();
  const dashboard = useProviderDashboard();
  const { notifications, setNotifOpen } = dashboard;

  useEffect(() => {
    setMounted(true);

    const unreadNotifs = notifications.filter((n) => n.unread === true);

    let timeoutId: ReturnType<typeof setTimeout>;

    if (unreadNotifs.length > 0) {
      timeoutId = setTimeout(() => {
        toast.info("You have unread notifications");
        setNotifOpen(true);
      }, 5000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [notifications, setNotifOpen]);

  const handleLogout = () => {
    performLogout(queryClient, ROUTES.provider.auth);
  };

  if (!mounted) {
    return (
      <div className="bg-app-gradient flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <ProviderHomeShell dashboard={dashboard} />
      <ProviderDashboardModals
        dashboard={dashboard}
        isApproved={isApproved}
        isAuthLoading={isAuthLoading}
        authProfile={authProfile}
        onLogout={handleLogout}
        router={router}
      />
    </div>
  );
}
