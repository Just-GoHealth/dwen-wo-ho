import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/configs/config";
import { clearRefreshCookie } from "@/lib/auth/server/refresh-cookie";

// SEC-01: the HttpOnly refresh cookie can only be cleared server-side.
// Backend sign-out is best effort — the cookie is cleared regardless.
export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (authorization) {
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/sign-out`, {
        method: "POST",
        headers: { Authorization: authorization, Accept: "*/*" },
        cache: "no-store",
      });
    } catch {
      // Backend unreachable — still clear the local session below.
    }
  }

  const res = NextResponse.json({ success: true, message: "Signed out" });
  clearRefreshCookie(res);
  return res;
}
