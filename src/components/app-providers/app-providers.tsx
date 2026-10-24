"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import TanstackQueryProvider from "./tanstack-query-provider";
import JotaiProvider from "./jotai-provider";
import { LiveUpdatesProvider } from "@/components/app-providers/live-updates-provider";
import { OnlineStatus } from "./online-status";
import MotionProvider from "./motion-provider";

export default function Providers({
  children,
  nonce,
}: Readonly<{
  children: ReactNode;
  nonce?: string;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      nonce={nonce}
    >
      <JotaiProvider>
        <TanstackQueryProvider>
          <LiveUpdatesProvider>
            <OnlineStatus />
            <MotionProvider>{children}</MotionProvider>
          </LiveUpdatesProvider>
        </TanstackQueryProvider>
      </JotaiProvider>
    </ThemeProvider>
  );
}
