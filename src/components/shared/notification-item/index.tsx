"use client";

import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils/shared/time-ago";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";
import type { NotifItemProps } from "@/lib/types/components/shared/notification-item";

/**
 * A single notification row in the notifications sheet with redesigned card layout.
 */
export default function NotifItem<N>({
  notif,
  isUnread,
  onMarkRead,
  onDelete,
  onClick,
  status = "idle",
  getAvatarUrl,
  getEmoji,
  getTitle,
  getText,
  getTimestamp,
}: NotifItemProps<N>) {
  const isMarkingRead = status === "marking-read";
  const isDeleting = status === "deleting";
  const avatarUrl = getAvatarUrl(notif);
  const emoji = getEmoji(notif);
  const title = getTitle(notif);
  const text = getText(notif);
  const timestamp = getTimestamp(notif);
  const relativeTime = timeAgo(timestamp);

  const handleActivate = () => {
    if (isUnread) onMarkRead();
    onClick?.();
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        role="button"
        tabIndex={0}
        aria-label={title || "Notification"}
        onClick={handleActivate}
        onKeyDown={activateOnKeyboard(handleActivate)}
        className={cn(
          "relative flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-all duration-300 ease-in-out",
          isUnread
            ? "bg-success/15 border-success/20 border-l-success/50 border-l-3 shadow-sm"
            : "bg-muted border-muted",
        )}
      >
        {/* Avatar */}
        <Avatar
          className={cn(
            "border-success/20 size-10 shrink-0 rounded-md border",
            !isUnread && "border-muted-foreground/10",
          )}
        >
          <AvatarImage src={avatarUrl ?? undefined} className="rounded-none" />
          {title || emoji ? (
            <AvatarFallback className="bg-muted dark:bg-muted-foreground/30 dark:text-foreground rounded-none text-sm">
              {emoji ? emoji : (title || "N").charAt(0).toUpperCase()}
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-muted dark:bg-muted-foreground/30 dark:text-foreground rounded-none text-sm">
              N
            </AvatarFallback>
          )}
        </Avatar>

        {/* Body */}
        <div className="min-w-0 flex-1">
          {/* Green badge with name/title */}
          <div className="mb-1 flex items-center gap-2">
            <span
              className={cn(
                "rounded-sm px-2.5 py-0.5 text-xs font-semibold",
                isUnread
                  ? "bg-success text-white"
                  : "bg-muted-foreground/10 text-muted-foreground font-normal",
              )}
            >
              {title || "Notification"}
            </span>
          </div>

          {/* Message text as bold subtitle */}
          <p
            className={cn(
              "mb-0.5 text-sm",
              !isUnread && "text-muted-foreground font-normal",
            )}
          >
            {text}
          </p>

          {/* Meta with dot separator */}
          <p className="text-muted-foreground text-xs">{relativeTime}</p>
        </div>

        {/* Right side: Green dot for unread + Actions */}
        <div className="flex shrink-0 flex-col items-center gap-2">
          {/* Unread indicator dot */}
          {isUnread && <span className="bg-success h-2 w-2 rounded-full" />}

          {/* Actions */}
          <div className={cn("mt-1 flex flex-col gap-1", !isUnread && "mt-5")}>
            {isUnread ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkRead();
                    }}
                    disabled={isMarkingRead}
                    className="text-success flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isMarkingRead ? (
                      <Spinner className="size-3.5" />
                    ) : (
                      <Check size={16} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-[10px]">Mark as read</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                type="button"
                disabled
                className="text-muted-foreground/50 flex h-7 w-7 cursor-not-allowed items-center justify-center rounded-md"
              >
                <Check size={16} />
              </button>
            )}

            {onDelete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    disabled={isDeleting}
                    className="text-destructive hover:bg-destructive/10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Spinner className="size-3.5" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-[10px]">Delete</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
