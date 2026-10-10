import { NextRequest } from "next/server";
import { relayTokenIssuingRequest } from "@/lib/auth/server/refresh-cookie";

// SEC-01: moves the issued refresh token into an HttpOnly cookie.
export async function POST(request: NextRequest) {
  return relayTokenIssuingRequest(request, "/api/v1/auth/sign-in");
}
