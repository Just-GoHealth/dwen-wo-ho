"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ProviderAuthShell } from "@/components/provider/auth/auth-shell";
import NewPassword from "@/components/provider/auth/new-password/index";

export function ProviderNewPasswordScreen() {
  return (
    <ProviderAuthShell>
      <Suspense
        fallback={
          <div className="bg-app-gradient flex h-screen w-full items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        }
      >
        <NewPassword />
      </Suspense>
    </ProviderAuthShell>
  );
}
