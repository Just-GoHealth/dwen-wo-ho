"use client";

import { ReactNode } from "react";
import { installSessionHandlers } from "@/lib/auth/session";
import { useLiveStream } from "@/hooks/realtime/use-live-stream";

// Once per client bundle: a second 401 after refresh sends the user to sign-in.
if (typeof window !== "undefined") installSessionHandlers();

/** App-wide session wiring and the `/me/stream` SSE connection. */
export function LiveUpdatesProvider({ children }: { children: ReactNode }) {
  useLiveStream();
  return <>{children}</>;
}
