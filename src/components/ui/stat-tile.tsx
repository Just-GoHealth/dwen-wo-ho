import type { ComponentType } from "react";
import { StatTile as UiStatTile } from "@just-gohealth/ui";
import { cn } from "@/lib/utils";

export interface StatTileProps {
  /** Any icon component (lucide-react or react-icons) accepting a className. */
  icon: ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  /** Classes for the icon's colored chip background (e.g. "bg-primary/10") */
  iconWrapperClassName?: string;
  /** Classes for the icon itself (e.g. "text-primary") */
  iconClassName?: string;
  className?: string;
}

/**
 * Backed by `@just-gohealth/ui`'s StatTile. The package's icon chip is made
 * transparent so the caller's per-stat chip colour still shows.
 */
export function StatTile({
  icon: Icon,
  value,
  label,
  iconWrapperClassName = "bg-primary/10",
  iconClassName = "text-primary",
  className,
}: StatTileProps) {
  return (
    <UiStatTile
      value={value}
      label={label}
      icon={
        <span
          className={cn(
            "flex size-full items-center justify-center rounded-lg",
            iconWrapperClassName,
          )}
        >
          <Icon className={iconClassName} />
        </span>
      }
      className={cn("shadow-sm [&>div:first-child]:bg-transparent", className)}
    />
  );
}
