import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { REFRESH_COOKIE } from "@/lib/auth/server/refresh-cookie";
import { API_BASE_URL } from "@/configs/config";
import { POST as signIn } from "./sign-in/route";
import { POST as createAccount } from "./create-account/route";
import { POST as submitSignupCode } from "./submit-signup-code/route";
import { POST as resetPassword } from "./reset-password/route";
import { POST as refresh } from "./refresh-token/route";
import { POST as signOut } from "./sign-out/route";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function request(
  path: string,
  init: { body?: unknown; headers?: Record<string, string> } = {},
): NextRequest {
  return new NextRequest(`http://localhost${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...init.headers },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
}

describe("auth route handlers", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    ["sign-in", signIn],
    ["create-account", createAccount],
    ["submit-signup-code", submitSignupCode],
    ["reset-password", resetPassword],
  ] as const)(
    "%s forwards to the backend and keeps the refresh token server-side",
    async (name, handler) => {
      fetchMock.mockResolvedValue(
        jsonResponse({ data: { token: "access", refreshToken: "refresh" } }),
      );

      const res = await handler(
        request(`/api/v1/auth/${name}`, { body: { email: "a@b.c" } }),
      );

      expect(fetchMock.mock.calls[0][0]).toBe(
        `${API_BASE_URL}/api/v1/auth/${name}`,
      );
      expect((await res.json()).data.refreshToken).toBeUndefined();
      expect(res.cookies.get(REFRESH_COOKIE)?.value).toBe("refresh");
    },
  );

  it("refresh-token uses the cookie, not the request body", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: { accessToken: "a2" } }));

    await refresh(
      new NextRequest("http://localhost/api/v1/auth/refresh-token", {
        method: "POST",
        headers: { cookie: `${REFRESH_COOKIE}=from-cookie` },
      }),
    );

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      refreshToken: "from-cookie",
    });
  });

  describe("sign-out", () => {
    it("signs out on the backend and clears the cookie", async () => {
      fetchMock.mockResolvedValue(jsonResponse({ success: true }));

      const res = await signOut(
        request("/api/v1/auth/sign-out", {
          headers: { authorization: "Bearer access-1" },
        }),
      );

      expect(fetchMock).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/v1/auth/sign-out`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer access-1",
          }),
        }),
      );
      expect(res.status).toBe(200);
      expect(res.cookies.get(REFRESH_COOKIE)?.maxAge).toBe(0);
    });

    it("clears the cookie without a backend call when there is no token", async () => {
      const res = await signOut(request("/api/v1/auth/sign-out"));

      expect(fetchMock).not.toHaveBeenCalled();
      expect(res.cookies.get(REFRESH_COOKIE)?.maxAge).toBe(0);
    });

    it("clears the cookie even when the backend is unreachable", async () => {
      fetchMock.mockRejectedValue(new Error("offline"));

      const res = await signOut(
        request("/api/v1/auth/sign-out", {
          headers: { authorization: "Bearer access-1" },
        }),
      );

      expect(res.status).toBe(200);
      expect(res.cookies.get(REFRESH_COOKIE)?.maxAge).toBe(0);
    });
  });
});
