import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Base pulsing placeholder block — compose feature-specific skeletons from this. */
function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
