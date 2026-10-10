import { describe, expect, it, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { API_BASE_URL } from "@/configs/config";

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

  it("allows the API origin over https and websockets", () => {
    const connectSrc = cspOf().get("connect-src") ?? "";
    const apiOrigin = new URL(API_BASE_URL).origin;

    expect(connectSrc).toContain(apiOrigin);
    expect(connectSrc).toContain(apiOrigin.replace(/^http/, "ws"));
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
