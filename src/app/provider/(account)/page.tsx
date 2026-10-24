"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useQueryClient } from "@tanstack/react-query";
import useProviderDashboard from "@/hooks/provider/dashboard/use-dashboard";
import { useProviderMe } from "@/hooks/queries/use-provider-me";
import { performLogout } from "@/lib/auth/session";
import { ROUTES } from "@/lib/constants/infra/routes";
import {
  isProviderApproved,
  routeForProviderNext,
} from "@/lib/utils/auth/provider-next-route";
import { ProviderHomeShell } from "@/components/provider/dashboard/provider-home-shell";
import ProviderDashboardModals from "@/components/provider/dashboard/dashboard-overlay-host";

export default function ProviderHomePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile, isLoading, isError } = useProviderMe();
  const isApproved = isProviderApproved(profile?.next);
  const dashboard = useProviderDashboard(isApproved);

  // Home is for approved providers; everyone else goes where `next` says.
  useEffect(() => {
    if (isError) router.replace(ROUTES.provider.auth as Route);
    else if (profile && !isApproved)
      router.replace(routeForProviderNext(profile.next) as Route);
  }, [isApproved, isError, profile, router]);

  const handleLogout = () => {
    void performLogout(queryClient, ROUTES.provider.auth);
  };

  if (isLoading || !isApproved) {
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
        onLogout={handleLogout}
        router={router}
      />
    </div>
  );
}
