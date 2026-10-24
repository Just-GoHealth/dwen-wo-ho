"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type {
  NotificationFilterTabProps,
  NotificationFilterTabsProps,
} from "@/lib/types/components/shared/notification-sheet";

function NotificationFilterTab({
  active,
  onClick,
  count,
  label,
  showBadge,
}: NotificationFilterTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-md px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 ease-out",
        active
          ? "bg-background text-foreground ring-border shadow-sm ring-1"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
      )}
    >
      <span className="flex items-center gap-1.5">
        {label}
        {showBadge ? (
          <span
            className={cn(
              "min-w-4 rounded-full px-1.5 py-0 text-center text-[9px] font-bold",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-muted-foreground/20 text-muted-foreground",
            )}
          >
            {count}
          </span>
        ) : (
          <span
            className={cn(
              "text-[10px] tabular-nums",
              active ? "text-muted-foreground" : "text-muted-foreground/50",
            )}
          >
            {count}
          </span>
        )}
      </span>
    </button>
  );
}

export function NotificationFilterTabs({
  filter,
  onFilterChange,
  totalCount,
  unreadCount,
  readCount,
  unreadCountForActions,
  hasNotifications,
  markAllRead,
  clearAllNotifications,
  isMarkingAllRead,
  isClearing,
}: NotificationFilterTabsProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="bg-muted/50 flex w-fit items-center gap-1 rounded-lg p-1">
        <NotificationFilterTab
          active={filter === "all"}
          onClick={() => onFilterChange("all")}
          count={totalCount}
          label="All"
        />
        <NotificationFilterTab
          active={filter === "unread"}
          onClick={() => onFilterChange("unread")}
          count={unreadCount}
          label="Unread"
          showBadge={unreadCount > 0}
        />
        <NotificationFilterTab
          active={filter === "read"}
          onClick={() => onFilterChange("read")}
          count={readCount}
          label="Read"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        {unreadCountForActions > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={markAllRead}
                  disabled={isMarkingAllRead}
                  className="text-muted-foreground hover:bg-info/15 hover:text-info flex h-fit items-center justify-center rounded-md p-1.5 transition-colors active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isMarkingAllRead ? (
                    <Spinner className="size-4" />
                  ) : (
                    <CheckCircle className="size-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                <p className="text-[10px]"> Mark all read</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {hasNotifications && clearAllNotifications && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  disabled={isClearing}
                  className="text-muted-foreground hover:bg-destructive/15 hover:text-destructive flex h-fit items-center justify-center rounded-md p-1.5 transition-colors active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isClearing ? (
                    <Spinner className="size-4" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                <p className="text-[10px]">Clear all</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
