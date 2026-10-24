import { describe, expect, it } from "vitest";
import { ROUTES } from "@/lib/constants/infra/routes";
import {
  isProviderApproved,
  routeForMe,
  routeForProviderNext,
} from "@/lib/utils/auth/provider-next-route";
import type { Me } from "@/lib/v2/types";

const providerMe = (next: Me["next"]): Me =>
  ({
    accountId: "a1",
    role: "PROVIDER",
    contact: "ama@example.com",
    next,
    profile: null,
  }) as Me;

describe("routeForProviderNext", () => {
  it.each([
    ["PROFILE_SETUP", `${ROUTES.provider.signUp}?step=profile`],
    ["PENDING", ROUTES.provider.application],
    ["REJECTED", ROUTES.provider.application],
    ["HOME", ROUTES.provider.home],
  ] as const)("routes %s to %s", (next, route) => {
    expect(routeForProviderNext(next)).toBe(route);
  });

  it("sends an unknown session back to sign-in", () => {
    expect(routeForProviderNext(null)).toBe(ROUTES.provider.auth);
  });
});

describe("routeForMe", () => {
  it("routes providers by next", () => {
    expect(routeForMe(providerMe("PENDING"))).toBe(ROUTES.provider.application);
    expect(routeForMe(providerMe("HOME"))).toBe(ROUTES.provider.home);
  });

  it("sends curators to the curator dashboard", () => {
    expect(routeForMe({ ...providerMe("HOME"), role: "CURATOR" } as Me)).toBe(
      ROUTES.curator.dashboard,
    );
  });
});

describe("isProviderApproved", () => {
  it("is only true for HOME", () => {
    expect(isProviderApproved("HOME")).toBe(true);
    expect(isProviderApproved("PENDING")).toBe(false);
    expect(isProviderApproved("REJECTED")).toBe(false);
    expect(isProviderApproved("PROFILE_SETUP")).toBe(false);
  });
});
