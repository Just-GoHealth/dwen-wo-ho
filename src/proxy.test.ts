import { describe, expect, it, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { isApiPath, proxy } from "@/proxy";

function cspOf(path = "/provider"): Map<string, string> {
  const res = proxy(new NextRequest(`http://localhost${path}`));
  const header = res.headers.get("Content-Security-Policy") ?? "";
  return new Map(
    header
      .split(";")
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => {
        const [name, ...values] = d.split(/\s+/);
        return [name, values.join(" ")] as [string, string];
      }),
  );
}

describe("proxy (CSP)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sets a nonce-based script-src with strict-dynamic", () => {
    const scriptSrc = cspOf().get("script-src") ?? "";

    expect(scriptSrc).toMatch(/'nonce-[A-Za-z0-9+/=]+'/);
    expect(scriptSrc).toContain("'strict-dynamic'");
    expect(scriptSrc).not.toContain("'unsafe-inline'");
  });

  it("uses a different nonce on every request", () => {
    const a = cspOf().get("script-src");
    const b = cspOf().get("script-src");

    expect(a).not.toBe(b);
  });

  it("locks down framing, plugins, base and form targets", () => {
    const csp = cspOf();

    expect(csp.get("frame-ancestors")).toBe("'none'");
    expect(csp.get("object-src")).toBe("'none'");
    expect(csp.get("base-uri")).toBe("'self'");
    expect(csp.get("form-action")).toBe("'self'");
  });

  it("keeps the API and SSE stream same-origin (connect-src 'self')", () => {
    const connectSrc = cspOf().get("connect-src") ?? "";

    expect(connectSrc).toContain("'self'");
    expect(connectSrc).not.toContain("ws");
  });

  it("passes proxied API paths through without a CSP", () => {
    for (const path of ["/auth/me", "/me/stream", "/results/abc"]) {
      const res = proxy(new NextRequest(`http://localhost${path}`));
      expect(res.headers.get("Content-Security-Policy")).toBeNull();
    }
  });

  it("does not treat app pages as API paths", () => {
    expect(isApiPath("/provider/patients/1")).toBe(false);
    expect(isApiPath("/curator/providers")).toBe(false);
    expect(isApiPath("/providers/me")).toBe(true);
  });

  it("allows unsafe-eval only in development", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(cspOf().get("script-src")).not.toContain("'unsafe-eval'");

    vi.stubEnv("NODE_ENV", "development");
    expect(cspOf().get("script-src")).toContain("'unsafe-eval'");
  });

  it("sets the other security headers", () => {
    const res = proxy(new NextRequest("http://localhost/provider"));

    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
  });
});
