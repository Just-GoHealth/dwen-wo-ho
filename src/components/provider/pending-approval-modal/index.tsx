"use client";

import { useState } from "react";
import { useHydrated } from "@/hooks/shared/use-hydrated";
import { m } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Clock,
  LogOut,
  Phone,
  Mail,
  Check,
  Circle,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PENDING_APPROVAL_TEXTS } from "@/lib/constants/components/provider/pending-approval-modal/content";
import { Logo } from "@/components/shared/logo";
import type { PendingApprovalModalProps } from "@/lib/types/components/provider/pending-approval-modal";
import { useTheme } from "next-themes";

export function PendingApprovalModal({
  userInfo,
  onLogout,
  status = "PENDING",
  onEdit,
  onResubmit,
  isResubmitting = false,
}: PendingApprovalModalProps) {
  const isRejected = status === "REJECTED";
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const role = userInfo.title || userInfo.specialty;
  const initials = userInfo.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const { theme } = useTheme();
  const mounted = useHydrated();
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center p-4 backdrop-blur-xs">
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "bg-background border-border w-full max-w-3xl rounded-2xl border shadow-2xl lg:max-w-4xl",
          "scrollbar-hide max-h-[90vh] overflow-y-auto",
        )}
      >
        {/* Header */}
        <div className="border-border/20 flex items-center justify-between border-b px-3 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Logo
              withLink={false}
              variant={mounted && theme === "light" ? "black" : "white"}
              className="h-auto w-30 sm:w-auto"
            />
          </div>
          <span
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-semibold",
              isRejected
                ? "bg-destructive/10 text-destructive"
                : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500",
            )}
          >
            {PENDING_APPROVAL_TEXTS.headerLabel}
          </span>
        </div>

        {/* Hero: profile + status */}
        <div className="border-border/20 flex flex-col items-center gap-4 border-b px-3 py-4 sm:flex-row sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-4 text-center sm:text-left">
            <div className="relative shrink-0">
              <Avatar className="ring-primary/20 ring-offset-background size-20 ring-4 ring-offset-2">
                <AvatarImage
                  src={userInfo.profileImage}
                  alt={userInfo.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="border-background absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full border-2 bg-yellow-500">
                <Clock className="size-3.5 text-white" aria-hidden />
              </div>
            </div>

            <div className="min-w-0 space-y-1">
              <h2 className="text-foreground truncate text-xl font-bold">
                {userInfo.name}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {role}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Submitted {userInfo.timeAgo}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <div className="relative size-[72px]" aria-hidden>
              <svg
                className="absolute inset-0 size-full -rotate-90"
                viewBox="0 0 72 72"
              >
                <circle
                  cx="36"
                  cy="36"
                  r="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-yellow-500/15"
                />
                <m.circle
                  cx="36"
                  cy="36"
                  r="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="40 161"
                  className="text-yellow-500"
                  style={{ transformOrigin: "50% 50%" }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="size-7 text-yellow-500" />
              </div>
            </div>
            <span className="text-foreground text-base font-semibold whitespace-nowrap">
              {isRejected
                ? PENDING_APPROVAL_TEXTS.rejectedStatus
                : PENDING_APPROVAL_TEXTS.status}
            </span>
          </div>
        </div>

        {isRejected && (
          <div className="border-border/20 space-y-3 border-b px-3 py-4 sm:px-6">
            <p className="text-sm font-semibold">
              {PENDING_APPROVAL_TEXTS.rejectedTitle}
            </p>
            <p className="text-muted-foreground text-sm text-pretty">
              {PENDING_APPROVAL_TEXTS.rejectedMessage}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {onEdit && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onEdit}
                  className="w-full sm:w-auto"
                >
                  <Pencil className="size-4" aria-hidden />
                  {PENDING_APPROVAL_TEXTS.edit}
                </Button>
              )}
              {onResubmit && (
                <LoadingButton
                  type="button"
                  onClick={onResubmit}
                  loading={isResubmitting}
                  loadingText={PENDING_APPROVAL_TEXTS.resubmitting}
                  className="w-full sm:w-auto"
                >
                  <RotateCcw className="size-4" aria-hidden />
                  {PENDING_APPROVAL_TEXTS.resubmit}
                </LoadingButton>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="border-border/20 border-b px-3 py-4 sm:px-6">
          <div className="relative flex">
            <div className="bg-border absolute top-5 right-[16.5%] left-[16.5%] h-px" />

            <div className="relative z-10 flex flex-1 flex-col items-center text-center">
              <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-green-800">
                <Check className="size-4.5 text-white" aria-hidden />
              </div>
              <p className="text-sm font-semibold">Application submitted</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {userInfo.timeAgo}
              </p>
            </div>

            <div className="relative z-10 flex flex-1 flex-col items-center text-center">
              <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-yellow-700">
                <Clock className="size-4.5 text-white" aria-hidden />
              </div>
              <p className="text-sm font-semibold">Under review</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                In progress
              </p>
            </div>

            <div className="relative z-10 flex flex-1 flex-col items-center text-center">
              <div className="bg-muted mb-2 flex size-10 items-center justify-center rounded-full">
                <Circle
                  className="text-muted-foreground size-4.5"
                  aria-hidden
                />
              </div>
              <p className="text-sm font-semibold">Decision</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {isRejected ? "Not accepted" : "Awaiting"}
              </p>
            </div>
          </div>
        </div>

        {/* While you wait + Contact */}
        <div className="grid grid-cols-1 gap-3 px-3 py-4 sm:px-6 md:grid-cols-2">
          <div className="bg-muted/40 rounded-xl p-4">
            <p className="mb-2 text-sm font-semibold">While you wait</p>
            <ul className="space-y-2">
              <li className="text-muted-foreground flex items-start gap-2.5 text-sm">
                <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
                {`We'll email you as soon as a decision is made`}
              </li>
              <li className="text-muted-foreground flex items-start gap-2.5 text-sm">
                <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                {`Reach out anytime if you'd like an update`}
              </li>
              <li className="text-muted-foreground flex items-start gap-2.5 text-sm">
                <LogOut className="mt-0.5 size-4 shrink-0" aria-hidden />
                You can safely log out and check back later
              </li>
            </ul>
          </div>

          <div className="bg-muted/40 rounded-xl p-4">
            <p className="mb-2 text-sm font-semibold">
              Contact verification team
            </p>
            <p className="text-muted-foreground mb-2 text-sm text-pretty">
              {PENDING_APPROVAL_TEXTS.contactMessage}
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={`tel:${PENDING_APPROVAL_TEXTS.phone}`}
                className="text-primary flex w-fit items-center gap-2 text-sm transition-colors hover:underline"
              >
                <Phone className="size-4 shrink-0" aria-hidden />
                {PENDING_APPROVAL_TEXTS.phone}
              </a>
              <a
                href={`mailto:${PENDING_APPROVAL_TEXTS.email}`}
                className="text-primary flex w-fit items-center gap-2 text-sm break-all transition-colors hover:underline"
              >
                <Mail className="size-4 shrink-0" aria-hidden />
                {PENDING_APPROVAL_TEXTS.email}
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-border/20 flex items-center justify-center border-t px-3 py-3 sm:px-6">
          <LoadingButton
            onClick={() => {
              setIsLoggingOut(true);
              onLogout();
            }}
            loading={isLoggingOut}
            loadingText={PENDING_APPROVAL_TEXTS.loggingOut}
            variant="destructive"
            className="w-auto min-w-30 gap-2 rounded-sm transition-all duration-300 motion-safe:hover:scale-105"
          >
            <LogOut className="size-4" aria-hidden />
            {PENDING_APPROVAL_TEXTS.logout}
          </LoadingButton>
        </div>
      </m.div>
    </div>
  );
}
