"use client";

import { m } from "motion/react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationBellProps } from "@/lib/types/components/shared/notification-bell";

export const NotificationBell = ({
  unreadCount,
  onOpenNotifs,
  icon: Icon = Bell,
  iconSize = 20,
  badgeColor = "bg-success",
  badgeSize = "size-2",
  pulseColor = "rgba(16,185,129,.5)",
  containerClassName,
  className,
  ...props
}: NotificationBellProps) => {
  void badgeColor;
  void badgeSize;
  void pulseColor;

  return (
    <div className={cn("flex items-center gap-2.5", containerClassName)}>
      <m.button
        whileTap={{ scale: 0.95 }}
        onClick={onOpenNotifs}
        className={cn(
          "bg-card/90 hover:bg-muted/80 relative flex size-9 items-center justify-center rounded-lg border transition-colors",
          className,
        )}
        aria-label="Open notifications"
        {...props}
      >
        <Icon size={iconSize} />
        {unreadCount > 0 && (
          <>
            {/* Unread count badge - top left. Bounces occasionally as a
                quiet passive cue instead of forcing the sheet open. */}
            <span className="bg-success animate-bell-badge-bounce absolute -top-2 -left-2 flex size-5 items-center justify-center rounded-full text-[8.5px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
            {/* Green beacon pulse - top right */}
            {/* <m.div
              animate={{
                boxShadow: [
                  `0 0 0 0 ${pulseColor}`,
                  `0 0 0 5px rgba(16,185,129,0)`,
                  `0 0 0 0 ${pulseColor}`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn(
                "absolute top-1.5 right-1.5 rounded-full border-2",
                badgeSize,
                badgeColor,
              )}
            /> */}
          </>
        )}
      </m.button>
    </div>
  );
};
