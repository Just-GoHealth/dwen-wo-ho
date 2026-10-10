"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import TanstackQueryProvider from "./tanstack-query-provider";
import JotaiProvider from "./jotai-provider";
import { StompProvider } from "@/components/app-providers/stomp-provider";
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
          <StompProvider>
            <OnlineStatus />
            <MotionProvider>{children}</MotionProvider>
          </StompProvider>
        </TanstackQueryProvider>
      </JotaiProvider>
    </ThemeProvider>
  );
}
