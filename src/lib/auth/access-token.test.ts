import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  clearTokens,
  getAccessToken,
  getRecoveryToken,
  LEGACY_TOKEN_STORAGE_KEYS,
  purgeLegacyTokenStorage,
  setAccessToken,
  setRecoveryToken,
} from "@/lib/auth/access-token";
import { mockBrowserStorage } from "@/lib/utils/shared/mock-browser-storage.test-helper";

describe("access-token store", () => {
  let storage: Map<string, string>;

  beforeEach(() => {
    storage = mockBrowserStorage();
    clearTokens();
  });

  afterEach(() => {
    clearTokens();
    vi.unstubAllGlobals();
  });

  it("keeps the access token in memory, never in storage", () => {
    setAccessToken("access-1");

    expect(getAccessToken()).toBe("access-1");
    expect(storage.size).toBe(0);
  });

  it("treats empty values as no token", () => {
    setAccessToken("");
    expect(getAccessToken()).toBeNull();

    setAccessToken(undefined);
    expect(getAccessToken()).toBeNull();
  });

  it("keeps the recovery token separately from the access token", () => {
    setAccessToken("access-1");
    setRecoveryToken("recovery-1");

    expect(getAccessToken()).toBe("access-1");
    expect(getRecoveryToken()).toBe("recovery-1");
  });

  it("clearTokens drops both tokens", () => {
    setAccessToken("access-1");
    setRecoveryToken("recovery-1");

    clearTokens();

    expect(getAccessToken()).toBeNull();
    expect(getRecoveryToken()).toBeNull();
  });

  it("purges every legacy token key and leaves other keys alone", () => {
    LEGACY_TOKEN_STORAGE_KEYS.forEach((key) => storage.set(key, "stale"));
    storage.set("userType", "provider");

    purgeLegacyTokenStorage();

    LEGACY_TOKEN_STORAGE_KEYS.forEach((key) => {
      expect(storage.has(key)).toBe(false);
    });
    expect(storage.get("userType")).toBe("provider");
  });

  it("does not throw when storage is unavailable", () => {
    vi.stubGlobal("localStorage", {
      removeItem: () => {
        throw new Error("blocked");
      },
    });

    expect(() => purgeLegacyTokenStorage()).not.toThrow();
  });
});
