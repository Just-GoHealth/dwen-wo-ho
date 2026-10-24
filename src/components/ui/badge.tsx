import * as React from "react";
import { Badge as UiBadge } from "@just-gohealth/ui";

import { cn } from "@/lib/utils";
import { DOMAIN_BADGE_CLASSES, type BadgeVariant } from "./badge-variants";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant | null;
}

/**
 * Backed by `@just-gohealth/ui`'s Badge. Generic variants map straight
 * through; the triage-* / severity-* variants are applied locally on top of
 * the package's base pill styles.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  if (variant && variant in DOMAIN_BADGE_CLASSES) {
    return (
      <UiBadge
        variant={null}
        className={cn(
          DOMAIN_BADGE_CLASSES[variant as keyof typeof DOMAIN_BADGE_CLASSES],
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <UiBadge
      variant={
        (variant ?? "default") as Exclude<
          BadgeVariant,
          keyof typeof DOMAIN_BADGE_CLASSES
        >
      }
      className={className}
      {...props}
    />
  );
}

export { Badge };
