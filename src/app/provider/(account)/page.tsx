"use client";

import { useState, useEffect, useRef } from "react";
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
  }, []);

  // Only pop the sheet open for a genuinely NEW unread notification, not
  // just because some already-seen one is still sitting there unread —
  // otherwise every notifications refetch re-triggers the popup forever
  // as long as anything is unread. Skips the initial population (prevIds
  // starts empty) so it doesn't fire on first load for old unread items.
  const prevNotificationIdsRef = useRef<Set<string | number> | null>(null);
  useEffect(() => {
    const currentIds = new Set(notifications.map((n) => n.notificationId));
    const prevIds = prevNotificationIdsRef.current;

    if (prevIds) {
      const newlyArrivedUnread = notifications.find(
        (n) => n.unread === true && !prevIds.has(n.notificationId),
      );
      if (newlyArrivedUnread) {
        const timeoutId = setTimeout(() => {
          toast.info("You have unread notifications");
          setNotifOpen(true);
        }, 5000);
        prevNotificationIdsRef.current = currentIds;
        return () => clearTimeout(timeoutId);
      }
    }

    prevNotificationIdsRef.current = currentIds;
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
