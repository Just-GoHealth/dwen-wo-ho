import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

const refreshSession = vi.fn();
const handleSessionExpired = vi.fn();

vi.mock("@/lib/v2/http", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/v2/http")>();
  return {
    ...actual,
    refreshSession,
    ensureCsrf: vi.fn().mockResolvedValue(undefined),
    readCookie: (name: string) =>
      name === "XSRF-TOKEN" ? "csrf-1" : undefined,
  };
});

vi.mock("@/lib/auth/session", () => ({ handleSessionExpired }));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

type ClientModule = typeof import("@/lib/api/client");

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("legacy api client (cookie session, no tokens)", () => {
  const fetchMock = vi.fn();
  let client: ClientModule;

  beforeEach(async () => {
    vi.resetModules();
    fetchMock.mockReset();
    refreshSession.mockReset();
    handleSessionExpired.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("window", {});
    client = await import("@/lib/api/client");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls same-origin with credentials and no Authorization header", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: { ok: true } }));

    const res = await client.api("/api/v1/schools");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/v1/schools");
    expect(init.credentials).toBe("include");
    expect(init.headers.Authorization).toBeUndefined();
    expect(res.data).toEqual({ ok: true });
  });

  it("echoes XSRF-TOKEN on unsafe methods only", async () => {
    // A fresh Response per call: a body can only be read once.
    fetchMock.mockImplementation(async () => jsonResponse({ data: {} }));

    await client.api("/api/v1/schools", { method: "POST", body: "{}" });
    await client.api("/api/v1/schools");

    expect(fetchMock.mock.calls[0][1].headers["X-XSRF-TOKEN"]).toBe("csrf-1");
    expect(fetchMock.mock.calls[1][1].headers["X-XSRF-TOKEN"]).toBeUndefined();
  });

  it("refreshes once on 401 and retries", async () => {
    refreshSession.mockResolvedValue(true);
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ code: "NOT_SIGNED_IN" }, 401))
      .mockResolvedValueOnce(jsonResponse({ data: { ok: true } }));

    const res = await client.api("/api/v1/schools");

    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(res.data).toEqual({ ok: true });
    expect(handleSessionExpired).not.toHaveBeenCalled();
  });

  it("ends the session when the retry is also 401", async () => {
    refreshSession.mockResolvedValue(true);
    fetchMock.mockResolvedValue(jsonResponse({ code: "NOT_SIGNED_IN" }, 401));

    await expect(client.api("/api/v1/schools")).rejects.toMatchObject({
      code: "NOT_SIGNED_IN",
    });
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(handleSessionExpired).toHaveBeenCalledTimes(1);
  });

  it("throws an ApiError carrying the problem detail", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ status: 409, code: "STALE", detail: "Reload" }, 409),
    );

    await expect(client.api("/api/v1/schools")).rejects.toMatchObject({
      code: "STALE",
      message: "Reload",
    });
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("returns text payloads for CSV responses", async () => {
    fetchMock.mockResolvedValue(
      new Response("a,b\n1,2", { headers: { "content-type": "text/csv" } }),
    );

    const res = await client.api("/api/v1/export");

    expect(res.data).toBe("a,b\n1,2");
  });
});
