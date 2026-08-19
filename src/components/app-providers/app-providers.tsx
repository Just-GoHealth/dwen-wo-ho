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
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
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
