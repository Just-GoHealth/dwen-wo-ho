import type { ComponentType } from "react";
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

export function StatTile({
  icon: Icon,
  value,
  label,
  iconWrapperClassName = "bg-primary/10",
  iconClassName = "text-primary",
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "bg-card border-border rounded-xl border p-4 shadow-sm",
        className,
      )}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            iconWrapperClassName,
          )}
        >
          <Icon className={cn("h-4 w-4", iconClassName)} />
        </div>
      </div>
      <h3 className="text-foreground mb-0.5 text-xl font-bold">{value}</h3>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}
