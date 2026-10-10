import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { mockBrowserStorage } from "@/lib/utils/shared/mock-browser-storage.test-helper";

const refreshToken = vi.fn();
const handleTokenExpiration = vi.fn();

vi.mock("@/lib/auth/session", () => ({
  refreshToken,
  handleTokenExpiration,
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

type ClientModule = typeof import("@/lib/api/client");
type TokenModule = typeof import("@/lib/auth/access-token");

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("api client", () => {
  let storage: Map<string, string>;
  const fetchMock = vi.fn();
  let client: ClientModule;
  let tokens: TokenModule;

  beforeEach(async () => {
    vi.resetModules();
    storage = mockBrowserStorage();
    fetchMock.mockReset();
    refreshToken.mockReset();
    handleTokenExpiration.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    tokens = await import("@/lib/auth/access-token");
    client = await import("@/lib/api/client");
  });

  afterEach(() => {
    tokens.clearTokens();
    vi.unstubAllGlobals();
  });

  it("calls same-origin in the browser and sends the in-memory token", async () => {
    tokens.setAccessToken("access-1");
    storage.set("userType", "provider");
    fetchMock.mockResolvedValue(jsonResponse({ data: { ok: true } }));

    const res = await client.api("/api/v1/schools");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/v1/schools");
    expect(init.headers.Authorization).toBe("Bearer access-1");
    expect(res.data).toEqual({ ok: true });
  });

  it("never sends a token read from localStorage", async () => {
    storage.set("token", "legacy-token");
    storage.set("refreshToken", "legacy-refresh");
    fetchMock.mockResolvedValue(jsonResponse({ data: {} }));

    await client.api("/api/v1/schools");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
  });

  it("does not attach the token to public endpoints", async () => {
    tokens.setAccessToken("access-1");
    fetchMock.mockResolvedValue(jsonResponse({ data: {} }));

    await client.api("/api/v1/auth/check-email", { method: "POST" });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
  });

  it("re-issues the access token after a reload before the first call", async () => {
    storage.set("userType", "provider");
    refreshToken.mockImplementation(async () => {
      tokens.setAccessToken("access-from-cookie");
      return "access-from-cookie";
    });
    fetchMock.mockResolvedValue(jsonResponse({ data: {} }));

    await client.api("/api/v1/schools");

    expect(refreshToken).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer access-from-cookie");
  });

  it("does not try to refresh without a session hint", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: {} }));

    await client.api("/api/v1/schools");

    expect(refreshToken).not.toHaveBeenCalled();
  });

  it("refreshes once on 401 and retries with the new token", async () => {
    tokens.setAccessToken("expired");
    storage.set("userType", "provider");
    refreshToken.mockImplementation(async () => {
      tokens.setAccessToken("fresh");
      return "fresh";
    });
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ message: "expired" }, 401))
      .mockResolvedValueOnce(jsonResponse({ data: { ok: true } }));

    const res = await client.api("/api/v1/schools");

    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe(
      "Bearer fresh",
    );
    expect(res.data).toEqual({ ok: true });
    expect(handleTokenExpiration).not.toHaveBeenCalled();
  });

  it("logs out when the refresh fails", async () => {
    tokens.setAccessToken("expired");
    refreshToken.mockResolvedValue(null);
    fetchMock.mockResolvedValue(jsonResponse({ message: "expired" }, 401));

    await expect(client.api("/api/v1/schools")).rejects.toThrow();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(handleTokenExpiration).toHaveBeenCalledTimes(1);
  });

  it("logs out instead of looping when the retry is also 401", async () => {
    tokens.setAccessToken("expired");
    refreshToken.mockResolvedValue("fresh");
    fetchMock.mockResolvedValue(jsonResponse({ message: "expired" }, 401));

    await expect(client.api("/api/v1/schools")).rejects.toThrow();

    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(handleTokenExpiration).toHaveBeenCalledTimes(1);
  });

  it("does not refresh when the caller sent its own Authorization header", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: "bad token" }, 401));

    await expect(
      client.api("/api/v1/schools", {
        headers: { Authorization: "Bearer recovery-token" },
      }),
    ).rejects.toThrow();

    expect(refreshToken).not.toHaveBeenCalled();
  });

  it("does not refresh on 403", async () => {
    tokens.setAccessToken("access-1");
    fetchMock.mockResolvedValue(jsonResponse({ message: "forbidden" }, 403));

    await expect(client.api("/api/v1/schools")).rejects.toThrow();

    expect(refreshToken).not.toHaveBeenCalled();
    expect(handleTokenExpiration).not.toHaveBeenCalled();
  });

  it("returns text payloads for CSV responses", async () => {
    fetchMock.mockResolvedValue(
      new Response("a,b\n1,2", { headers: { "content-type": "text/csv" } }),
    );

    const res = await client.api("/api/v1/export");

    expect(res.data).toBe("a,b\n1,2");
  });
});
