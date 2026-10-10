import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/configs/config";

/**
 * Strict, nonce-based Content-Security-Policy (SEC-01).
 *
 * Scripts only run if they come from this origin with the per-request nonce
 * (Next.js applies it to its own scripts automatically) or are loaded by such
 * a script ('strict-dynamic'). Injected inline scripts and event-handler
 * attributes are blocked, which is what turns an HTML-injection bug into a
 * non-event instead of a session takeover.
 */
const buildCsp = (nonce: string): string => {
  const isDev = process.env.NODE_ENV === "development";
  const apiOrigin = new URL(API_BASE_URL).origin;
  const apiWsOrigin = apiOrigin.replace(/^http/, "ws");

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      // React dev tooling needs eval for stack reconstruction.
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    // motion / next/font / Radix set inline style attributes at runtime.
    "style-src": ["'self'", "'unsafe-inline'"],
    // Profile photos and content images come from several CDNs (R2 buckets,
    // Unsplash, Microlink, emoji sprites); images can't execute script.
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": ["'self'", "data:"],
    "connect-src": [
      "'self'",
      apiOrigin,
      apiWsOrigin,
      // useOnlineStatus connectivity probe.
      "https://ipify.org",
      ...(isDev ? ["ws:"] : []),
    ],
    "frame-src": ["'none'"],
    "frame-ancestors": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  };

  const policy = Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");

  return isDev ? policy : `${policy}; upgrade-insecure-requests`;
};

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  // Next.js reads the nonce from the request's CSP header and stamps it on
  // the framework scripts it renders.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  return response;
}

export const config = {
  matcher: [
    // Pages only: skip API routes, static assets and prefetches.
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
