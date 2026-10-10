import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { ROUTES } from "@/lib/constants/infra/routes";
import { getSignInRoute } from "@/lib/utils/auth/sign-in-route";
import { mockBrowserStorage } from "@/lib/utils/shared/mock-browser-storage.test-helper";

describe("getSignInRoute", () => {
  let storage: Map<string, string>;

  beforeEach(() => {
    storage = mockBrowserStorage();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends curators to the curator sign-in screen", () => {
    expect(getSignInRoute("curator")).toBe(ROUTES.curator.auth);
  });

  it("sends providers to the provider sign-in screen", () => {
    expect(getSignInRoute("provider")).toBe(ROUTES.provider.auth);
  });

  it("falls back to the provider screen with no session", () => {
    expect(getSignInRoute(null)).toBe(ROUTES.provider.auth);
  });

  it("reads the stored user type by default", () => {
    storage.set("userType", "curator");
    expect(getSignInRoute()).toBe(ROUTES.curator.auth);
  });
});
