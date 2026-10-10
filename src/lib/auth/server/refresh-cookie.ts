import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/configs/config";

/**
 * Server-side half of SEC-01: the refresh token is held in an HttpOnly
 * `__Host-` cookie set by these same-origin route handlers, so client JS can
 * never read it. Route handlers under src/app/api/** are resolved before the
 * `/api/:path*` rewrite in next.config.ts, so they intercept exactly the
 * token-issuing endpoints while every other call proxies straight through.
 *
 * `__Host-` requires Secure + Path=/ + no Domain; browsers accept Secure
 * cookies on http://localhost, so this works in local dev too.
 */
export const REFRESH_COOKIE = "__Host-jg_refresh";

const FALLBACK_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

type TokenEnvelope = {
  data?: Record<string, unknown> & { refreshToken?: unknown };
  refreshToken?: unknown;
  [key: string]: unknown;
};

// Use the JWT's own `exp` for the cookie lifetime so the cookie never
// outlives the token. Not a signature check — the backend still validates it.
const getMaxAgeSeconds = (jwt: string): number => {
  try {
    const payload = JSON.parse(
      Buffer.from(jwt.split(".")[1] ?? "", "base64url").toString("utf8"),
    ) as { exp?: number };
    if (typeof payload.exp === "number") {
      return Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
    }
  } catch {
    // Opaque (non-JWT) refresh token — fall back to the default lifetime.
  }
  return FALLBACK_MAX_AGE_SECONDS;
};

export const setRefreshCookie = (res: NextResponse, refreshToken: string) => {
  res.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: getMaxAgeSeconds(refreshToken),
  });
};

export const clearRefreshCookie = (res: NextResponse) => {
  res.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
};

/**
 * Moves `refreshToken` out of a backend JSON body (top level or `data`) and
 * returns it, so the browser only ever sees the access token.
 */
const extractRefreshToken = (body: TokenEnvelope): string | null => {
  let token: unknown = null;
  if (body.data && typeof body.data === "object") {
    token = body.data.refreshToken;
    delete body.data.refreshToken;
  }
  if (body.refreshToken !== undefined) {
    token = token || body.refreshToken;
    delete body.refreshToken;
  }
  return typeof token === "string" && token ? token : null;
};

const buildBackendResponse = async (
  backendRes: Response,
): Promise<NextResponse> => {
  const text = await backendRes.text();
  let body: TokenEnvelope | null = null;
  try {
    body = text ? (JSON.parse(text) as TokenEnvelope) : null;
  } catch {
    body = null;
  }

  if (!body) {
    return new NextResponse(text, {
      status: backendRes.status,
      headers: {
        "content-type": backendRes.headers.get("content-type") ?? "text/plain",
      },
    });
  }

  const refreshToken = backendRes.ok ? extractRefreshToken(body) : null;
  const res = NextResponse.json(body, { status: backendRes.status });
  if (refreshToken) {
    setRefreshCookie(res, refreshToken);
  }
  return res;
};

/**
 * Forwards a token-issuing request (sign-in, signup code, password reset) to
 * the backend unchanged, then swaps the returned refresh token into the
 * HttpOnly cookie.
 */
export const relayTokenIssuingRequest = async (
  request: NextRequest,
  backendPath: string,
): Promise<NextResponse> => {
  const headers: Record<string, string> = {
    Accept: "*/*",
    "Content-Type": request.headers.get("content-type") ?? "application/json",
  };
  const authorization = request.headers.get("authorization");
  if (authorization) {
    headers.Authorization = authorization;
  }

  try {
    const backendRes = await fetch(`${API_BASE_URL}${backendPath}`, {
      method: "POST",
      headers,
      body: await request.text(),
      cache: "no-store",
    });
    return await buildBackendResponse(backendRes);
  } catch {
    return NextResponse.json(
      { success: false, message: "Authentication service unavailable" },
      { status: 502 },
    );
  }
};

/**
 * Exchanges the HttpOnly refresh cookie for a new access token, rotating the
 * cookie if the backend issues a new refresh token.
 */
export const relayRefresh = async (
  request: NextRequest,
  backendPath: string,
): Promise<NextResponse> => {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "No session" },
      { status: 401 },
    );
  }

  try {
    const backendRes = await fetch(`${API_BASE_URL}${backendPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    const res = await buildBackendResponse(backendRes);
    if (backendRes.status === 401 || backendRes.status === 403) {
      // Refresh token rejected — drop it so the client stops retrying.
      clearRefreshCookie(res);
    }
    return res;
  } catch {
    return NextResponse.json(
      { success: false, message: "Authentication service unavailable" },
      { status: 502 },
    );
  }
};
