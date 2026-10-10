import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { ROUTES } from "@/lib/constants/infra/routes";
import {
  executeProviderFinishSignup,
  runProviderFinishSignupAutoLogin,
} from "@/lib/utils/auth/provider-finish-signup";
import { mockBrowserStorage } from "@/lib/utils/shared/mock-browser-storage.test-helper";
import { clearTokens, setAccessToken } from "@/lib/auth/access-token";

describe("executeProviderFinishSignup", () => {
  beforeEach(() => {
    mockBrowserStorage();
  });

  afterEach(() => {
    clearTokens();
    vi.unstubAllGlobals();
  });

  it("navigates home when a session already exists", async () => {
    setAccessToken("existing-token");
    const navigate = vi.fn();
    const login = vi.fn();

    await executeProviderFinishSignup({
      email: "user@example.com",
      password: "secret",
      login,
      navigate,
      onAutoLoginFailed: vi.fn(),
    });

    expect(navigate).toHaveBeenCalledWith(ROUTES.provider.home);
    expect(login).not.toHaveBeenCalled();
  });

  it("navigates to sign-in when auto-login fails", async () => {
    const navigate = vi.fn();
    const onAutoLoginFailed = vi.fn();
    const login = vi.fn().mockRejectedValue(new Error("Unauthorized"));

    await executeProviderFinishSignup({
      email: "user@example.com",
      password: "secret",
      login,
      navigate,
      onAutoLoginFailed,
    });

    expect(onAutoLoginFailed).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith(
      `${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent("user@example.com")}`,
    );
  });
});

describe("runProviderFinishSignupAutoLogin", () => {
  it("returns missing-password when password is empty", async () => {
    const login = vi.fn();

    const result = await runProviderFinishSignupAutoLogin(
      "user@example.com",
      "   ",
      login,
    );

    expect(result).toEqual({ kind: "missing-password" });
    expect(login).not.toHaveBeenCalled();
  });

  it("returns login-failed when login throws", async () => {
    const login = vi.fn().mockRejectedValue(new Error("Unauthorized"));

    const result = await runProviderFinishSignupAutoLogin(
      "user@example.com",
      "secret",
      login,
    );

    expect(result).toEqual({ kind: "login-failed" });
  });

  it("returns success with onboarding redirect target", async () => {
    const login = vi.fn().mockResolvedValue({
      token: "token",
      refreshToken: "refresh",
      userData: {
        nextStep: "phone",
        email: "user@example.com",
      },
    });

    const result = await runProviderFinishSignupAutoLogin(
      "user@example.com",
      "secret",
      login,
    );

    expect(result).toMatchObject({
      kind: "success",
      token: "token",
      refreshToken: "refresh",
    });
    expect(result.kind === "success" && result.targetPath).toContain(
      "step=bio",
    );
  });

  it("returns home when login succeeds without userData", async () => {
    const login = vi.fn().mockResolvedValue({
      token: "token",
    });

    const result = await runProviderFinishSignupAutoLogin(
      "user@example.com",
      "secret",
      login,
    );

    expect(result).toEqual({
      kind: "success",
      targetPath: ROUTES.provider.home,
      token: "token",
      refreshToken: undefined,
      userRole: undefined,
    });
  });
});
