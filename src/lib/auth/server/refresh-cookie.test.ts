import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import {
  clearRefreshCookie,
  REFRESH_COOKIE,
  relayRefresh,
  relayTokenIssuingRequest,
  setRefreshCookie,
} from "@/lib/auth/server/refresh-cookie";
import { API_BASE_URL } from "@/configs/config";

function jwtExpiringIn(seconds: number): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + seconds }),
  ).toString("base64url");
  return `header.${payload}.signature`;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function postRequest(
  path: string,
  body: unknown,
  headers: Record<string, string> = {},
): NextRequest {
  return new NextRequest(`http://localhost${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("refresh cookie helpers", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("setRefreshCookie / clearRefreshCookie", () => {
    it("sets an HttpOnly, Secure, SameSite=Strict __Host- cookie", () => {
      const res = NextResponse.json({});
      setRefreshCookie(res, jwtExpiringIn(3600));

      const cookie = res.cookies.get(REFRESH_COOKIE);
      expect(REFRESH_COOKIE.startsWith("__Host-")).toBe(true);
      expect(cookie?.httpOnly).toBe(true);
      expect(cookie?.secure).toBe(true);
      expect(cookie?.sameSite).toBe("strict");
      expect(cookie?.path).toBe("/");
    });

    it("takes the cookie lifetime from the JWT exp", () => {
      const res = NextResponse.json({});
      setRefreshCookie(res, jwtExpiringIn(3600));

      const maxAge = res.cookies.get(REFRESH_COOKIE)?.maxAge ?? 0;
      expect(maxAge).toBeGreaterThan(3590);
      expect(maxAge).toBeLessThanOrEqual(3600);
    });

    it("falls back to 7 days for an opaque token", () => {
      const res = NextResponse.json({});
      setRefreshCookie(res, "opaque-token");

      expect(res.cookies.get(REFRESH_COOKIE)?.maxAge).toBe(7 * 24 * 60 * 60);
    });

    it("clears the cookie with maxAge 0", () => {
      const res = NextResponse.json({});
      clearRefreshCookie(res);

      const cookie = res.cookies.get(REFRESH_COOKIE);
      expect(cookie?.value).toBe("");
      expect(cookie?.maxAge).toBe(0);
    });
  });

  describe("relayTokenIssuingRequest", () => {
    it("forwards the request and moves refreshToken into the cookie", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({
          success: true,
          data: { token: "access-1", refreshToken: "refresh-1" },
        }),
      );

      const res = await relayTokenIssuingRequest(
        postRequest("/api/v1/auth/sign-in", { email: "a@b.c", password: "x" }),
        "/api/v1/auth/sign-in",
      );

      expect(fetchMock).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/v1/auth/sign-in`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "a@b.c", password: "x" }),
        }),
      );
      const body = await res.json();
      expect(body.data.token).toBe("access-1");
      expect(body.data.refreshToken).toBeUndefined();
      expect(res.cookies.get(REFRESH_COOKIE)?.value).toBe("refresh-1");
    });

    it("also strips a top-level refreshToken", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({ token: "access-1", refreshToken: "refresh-top" }),
      );

      const res = await relayTokenIssuingRequest(
        postRequest("/api/v1/auth/reset-password", {}),
        "/api/v1/auth/reset-password",
      );

      const body = await res.json();
      expect(body.refreshToken).toBeUndefined();
      expect(res.cookies.get(REFRESH_COOKIE)?.value).toBe("refresh-top");
    });

    it("passes the caller's Authorization header through", async () => {
      fetchMock.mockResolvedValue(jsonResponse({ success: true, data: {} }));

      await relayTokenIssuingRequest(
        postRequest(
          "/api/v1/auth/reset-password",
          {},
          {
            authorization: "Bearer recovery-1",
          },
        ),
        "/api/v1/auth/reset-password",
      );

      const [, init] = fetchMock.mock.calls[0];
      expect(init.headers.Authorization).toBe("Bearer recovery-1");
    });

    it("keeps the backend status and sets no cookie on failure", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({ success: false, data: { refreshToken: "nope" } }, 401),
      );

      const res = await relayTokenIssuingRequest(
        postRequest("/api/v1/auth/sign-in", {}),
        "/api/v1/auth/sign-in",
      );

      expect(res.status).toBe(401);
      expect(res.cookies.get(REFRESH_COOKIE)).toBeUndefined();
    });

    it("relays non-JSON bodies unchanged", async () => {
      fetchMock.mockResolvedValue(
        new Response("Bad gateway", {
          status: 502,
          headers: { "content-type": "text/plain" },
        }),
      );

      const res = await relayTokenIssuingRequest(
        postRequest("/api/v1/auth/sign-in", {}),
        "/api/v1/auth/sign-in",
      );

      expect(res.status).toBe(502);
      expect(await res.text()).toBe("Bad gateway");
    });

    it("returns 502 when the backend is unreachable", async () => {
      fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

      const res = await relayTokenIssuingRequest(
        postRequest("/api/v1/auth/sign-in", {}),
        "/api/v1/auth/sign-in",
      );

      expect(res.status).toBe(502);
    });
  });

  describe("relayRefresh", () => {
    function refreshRequest(cookie?: string): NextRequest {
      return new NextRequest("http://localhost/api/v1/auth/refresh-token", {
        method: "POST",
        headers: cookie ? { cookie: `${REFRESH_COOKIE}=${cookie}` } : {},
      });
    }

    it("returns 401 without calling the backend when there is no cookie", async () => {
      const res = await relayRefresh(
        refreshRequest(),
        "/api/v1/auth/refresh-token",
      );

      expect(res.status).toBe(401);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("sends the cookie value to the backend and rotates the cookie", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({
          success: true,
          data: { accessToken: "access-2", refreshToken: "refresh-2" },
        }),
      );

      const res = await relayRefresh(
        refreshRequest("refresh-1"),
        "/api/v1/auth/refresh-token",
      );

      const [, init] = fetchMock.mock.calls[0];
      expect(JSON.parse(init.body)).toEqual({ refreshToken: "refresh-1" });
      const body = await res.json();
      expect(body.data.accessToken).toBe("access-2");
      expect(body.data.refreshToken).toBeUndefined();
      expect(res.cookies.get(REFRESH_COOKIE)?.value).toBe("refresh-2");
    });

    it("clears the cookie when the backend rejects the refresh token", async () => {
      fetchMock.mockResolvedValue(jsonResponse({ success: false }, 401));

      const res = await relayRefresh(
        refreshRequest("expired"),
        "/api/v1/auth/refresh-token",
      );

      expect(res.status).toBe(401);
      expect(res.cookies.get(REFRESH_COOKIE)?.maxAge).toBe(0);
    });

    it("returns 502 when the backend is unreachable", async () => {
      fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

      const res = await relayRefresh(
        refreshRequest("refresh-1"),
        "/api/v1/auth/refresh-token",
      );

      expect(res.status).toBe(502);
    });
  });
});
