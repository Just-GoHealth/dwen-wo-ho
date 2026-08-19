import { ReactNode } from "react";

/**
 * Routes that have been redesigned for the Bronze Fury look apply
 * `bg-app-gradient` themselves (home shell, patient detail) — this layout
 * stays a plain pass-through so not-yet-redesigned routes (profile,
 * schools) keep their existing flat background instead of the gradient
 * showing through their old, unmigrated card styling.
 */
export default function ProviderLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
