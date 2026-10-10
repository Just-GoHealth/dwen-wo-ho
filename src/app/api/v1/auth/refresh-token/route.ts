import { NextRequest } from "next/server";
import { relayRefresh } from "@/lib/auth/server/refresh-cookie";

// SEC-01: the refresh token comes from the HttpOnly cookie, never the client.
export async function POST(request: NextRequest) {
  return relayRefresh(request, "/api/v1/auth/refresh-token");
}
