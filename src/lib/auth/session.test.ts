import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { mockBrowserStorage } from "@/lib/utils/shared/mock-browser-storage.test-helper";
import { ROUTES } from "@/lib/constants/infra/routes";
import { STATIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";

type SessionModule = typeof import("@/lib/auth/session");
type TokenModule = typeof import("@/lib/auth/access-token");

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("auth session", () => {
  let storage: Map<string, string>;
  let replace: ReturnType<typeof vi.fn>;
  const fetchMock = vi.fn();
  let session: SessionModule;
  let tokens: TokenModule;

  function stubLocation(pathname: string) {
    replace = vi.fn();
    vi.stubGlobal("window", { location: { pathname, replace } });
  }

  beforeEach(async () => {
    // Fresh module state (in-flight refresh, logout guard) for every test.
    vi.resetModules();
    storage = mockBrowserStorage();
    stubLocation("/provider");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    tokens = await import("@/lib/auth/access-token");
    session = await import("@/lib/auth/session");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe("refreshToken", () => {
    it("calls the same-origin refresh route and keeps the token in memory", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({ success: true, data: { accessToken: "access-2" } }),
      );

      const token = await session.refreshToken();

      expect(token).toBe("access-2");
      expect(fetchMock).toHaveBeenCalledWith(
        STATIC_ENDPOINTS.AUTH.REFRESH_TOKEN,
        expect.objectContaining({
          method: "POST",
          credentials: "same-origin",
        }),
      );
      // The request carries no token: the refresh token is the HttpOnly cookie.
      const [, init] = fetchMock.mock.calls[0];
      expect(init.body).toBeUndefined();
      expect(tokens.getAccessToken()).toBe("access-2");
      expect(storage.get("token")).toBeUndefined();
      expect(storage.get("refreshToken")).toBeUndefined();
    });

    it("shares one request between concurrent callers", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({ success: true, data: { accessToken: "access-2" } }),
      );

      const [a, b] = await Promise.all([
        session.refreshToken(),
        session.refreshToken(),
      ]);

      expect(a).toBe("access-2");
      expect(b).toBe("access-2");
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("returns null when the refresh is rejected", async () => {
      fetchMock.mockResolvedValue(jsonResponse({ success: false }, 401));

      expect(await session.refreshToken()).toBeNull();
      expect(tokens.getAccessToken()).toBeNull();
    });

    it("returns null on a network error", async () => {
      fetchMock.mockRejectedValue(new Error("offline"));

      expect(await session.refreshToken()).toBeNull();
    });

    it("sets the user type from the role when none is stored", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({
          data: { token: "access-2", userData: { userRole: "ROLE_CURATOR" } },
        }),
      );

      await session.refreshToken();

      expect(storage.get("userType")).toBe("curator");
    });

    it("keeps an existing user type", async () => {
      storage.set("userType", "provider");
      fetchMock.mockResolvedValue(
        jsonResponse({
          data: { token: "access-2", userData: { userRole: "ROLE_CURATOR" } },
        }),
      );

      await session.refreshToken();

      expect(storage.get("userType")).toBe("provider");
    });
  });

  describe("performLogout", () => {
    it("clears the server cookie before redirecting", async () => {
      tokens.setAccessToken("access-1");
      storage.set("userType", "provider");
      fetchMock.mockResolvedValue(jsonResponse({ success: true }));

      await session.performLogout();

      expect(fetchMock).toHaveBeenCalledWith(
        STATIC_ENDPOINTS.AUTH.SIGN_OUT,
        expect.objectContaining({
          method: "POST",
          headers: { Authorization: "Bearer access-1" },
        }),
      );
      expect(fetchMock.mock.invocationCallOrder[0]).toBeLessThan(
        replace.mock.invocationCallOrder[0],
      );
    });

    it("clears memory, tokens and auth keys from storage", async () => {
      tokens.setAccessToken("access-1");
      storage.set("userType", "provider");
      storage.set("token", "legacy");
      storage.set("pendingUser:v1", "{}");
      storage.set("cached-schools", "[]");
      storage.set("theme", "dark");
      fetchMock.mockResolvedValue(jsonResponse({ success: true }));

      await session.performLogout();

      expect(tokens.getAccessToken()).toBeNull();
      expect(storage.has("userType")).toBe(false);
      expect(storage.has("token")).toBe(false);
      expect(storage.has("pendingUser:v1")).toBe(false);
      expect(storage.has("cached-schools")).toBe(false);
      expect(storage.get("theme")).toBe("dark");
    });

    it("sends curators to the curator sign-in screen", async () => {
      storage.set("userType", "curator");
      fetchMock.mockResolvedValue(jsonResponse({ success: true }));

      await session.performLogout();

      expect(replace).toHaveBeenCalledWith(ROUTES.curator.auth);
    });

    it("sends providers to the provider sign-in screen", async () => {
      storage.set("userType", "provider");
      fetchMock.mockResolvedValue(jsonResponse({ success: true }));

      await session.performLogout();

      expect(replace).toHaveBeenCalledWith(ROUTES.provider.auth);
    });

    it("honours an explicit redirect", async () => {
      fetchMock.mockResolvedValue(jsonResponse({ success: true }));

      await session.performLogout(undefined, "/somewhere");

      expect(replace).toHaveBeenCalledWith("/somewhere");
    });

    it("still logs out locally when the sign-out call fails", async () => {
      tokens.setAccessToken("access-1");
      fetchMock.mockRejectedValue(new Error("offline"));

      await session.performLogout();

      expect(tokens.getAccessToken()).toBeNull();
      expect(replace).toHaveBeenCalled();
    });

    it("clears the react-query cache when given one", async () => {
      fetchMock.mockResolvedValue(jsonResponse({ success: true }));
      const queryClient = { clear: vi.fn(), resetQueries: vi.fn() };

      await session.performLogout(queryClient as never);

      expect(queryClient.clear).toHaveBeenCalled();
    });

    it("does not let an in-flight refresh restore the session", async () => {
      let resolveRefresh: (res: Response) => void = () => {};
      fetchMock.mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            resolveRefresh = resolve;
          }),
      );
      fetchMock.mockResolvedValue(jsonResponse({ success: true }));

      const pending = session.refreshToken();
      await session.performLogout();
      resolveRefresh(jsonResponse({ data: { accessToken: "late-token" } }));

      expect(await pending).toBeNull();
      expect(tokens.getAccessToken()).toBeNull();
    });
  });

  describe("handleTokenExpiration", () => {
    it("redirects curators to the curator sign-in screen", async () => {
      vi.useFakeTimers();
      storage.set("userType", "curator");
      fetchMock.mockResolvedValue(jsonResponse({ success: true }));

      await session.handleTokenExpiration();

      expect(replace).toHaveBeenCalledWith(ROUTES.curator.auth);
      expect(storage.has("userType")).toBe(false);
    });

    it("does not redirect when already on a sign-in page", async () => {
      vi.useFakeTimers();
      stubLocation("/curator/auth");
      fetchMock.mockResolvedValue(jsonResponse({ success: true }));

      await session.handleTokenExpiration();

      expect(replace).not.toHaveBeenCalled();
    });

    it("handles concurrent expirations once", async () => {
      vi.useFakeTimers();
      fetchMock.mockResolvedValue(jsonResponse({ success: true }));

      await Promise.all([
        session.handleTokenExpiration(),
        session.handleTokenExpiration(),
      ]);

      expect(replace).toHaveBeenCalledTimes(1);
    });
  });
});
