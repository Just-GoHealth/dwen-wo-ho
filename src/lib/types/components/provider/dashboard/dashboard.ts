import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface ProviderDashboardOverlayHostProps<TDashboard = unknown> {
  dashboard: TDashboard;
  onLogout: () => void;
  router: AppRouterInstance;
}
