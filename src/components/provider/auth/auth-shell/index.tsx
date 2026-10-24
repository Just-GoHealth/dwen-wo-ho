import Image from "next/image";
import type { ReactNode } from "react";
import { AuthLayout } from "@just-gohealth/ui";

/**
 * Provider/curator auth split — backed by `@just-gohealth/ui`'s AuthLayout
 * (half-width photo panel from laptop up). The auth screens bring their own
 * full-width layout, so the package's centred `max-w-md` content column is
 * reset to a plain full-width column.
 */
export function ProviderAuthShell({ children }: { children: ReactNode }) {
  return (
    <AuthLayout
      mediaWidth="half"
      mediaAlt="mental-health"
      media={
        <>
          <div className="bg-destructive/5 absolute inset-0 z-10" />
          <Image
            src="/auth/mental-health-2.png"
            alt="mental-health"
            width={1080}
            height={1080}
            quality={100}
            priority
            className="h-full w-full object-cover"
          />
        </>
      }
      className="[&>[data-slot=auth-layout-content]>div]:max-w-none [&>[data-slot=auth-layout-content]>div]:justify-start [&>[data-slot=auth-layout-content]>div]:p-0"
    >
      {children}
    </AuthLayout>
  );
}
