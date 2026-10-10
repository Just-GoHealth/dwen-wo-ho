// @vitest-environment happy-dom

import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";

const getProfile = vi.fn();
const storage = new Map<string, string>();

vi.stubGlobal("localStorage", {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
  clear: () => {
    storage.clear();
  },
});

vi.mock("@/services/shared/auth", () => ({
  authService: {
    getProfile,
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

describe("useProviderDashboardAuth", () => {
  beforeEach(() => {
    vi.resetModules();
    getProfile.mockReset();
    storage.clear();
  });

  it("skips profile fetch and reports not approved when there is no session", async () => {
    const { default: useProviderDashboardAuth } =
      await import("./use-dashboard-auth");

    const { result } = renderHook(() => useProviderDashboardAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getProfile).not.toHaveBeenCalled();
    expect(result.current.isApproved).toBe(false);
    expect(result.current.authProfile).toBeUndefined();
  });

  it("loads profile when a session exists and reports approved status", async () => {
    storage.set("userType", "provider");
    getProfile.mockResolvedValue({
      id: "provider-1",
      email: "provider@example.com",
      applicationStatus: "APPROVED",
    });

    const { default: useProviderDashboardAuth } =
      await import("./use-dashboard-auth");

    const { result } = renderHook(() => useProviderDashboardAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.authProfile?.email).toBe("provider@example.com");
    });

    expect(getProfile).toHaveBeenCalled();
    expect(result.current.isApproved).toBe(true);
    expect(storage.get("providerId")).toBe("provider-1");
  });

  it("uses status fallback when applicationStatus is missing", async () => {
    storage.set("userType", "provider");
    getProfile.mockResolvedValue({
      email: "pending@example.com",
      status: "PENDING",
    });

    const { default: useProviderDashboardAuth } =
      await import("./use-dashboard-auth");

    const { result } = renderHook(() => useProviderDashboardAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.authProfile?.email).toBe("pending@example.com");
    });

    expect(result.current.isApproved).toBe(false);
    expect(storage.get("providerId")).toBe("pending@example.com");
  });
});
