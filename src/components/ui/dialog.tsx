"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  Dialog,
  DialogClose,
  DialogContent as UiDialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@just-gohealth/ui";

import { cn } from "@/lib/utils";

/*
 * Backed by `@just-gohealth/ui`'s Dialog family. DialogPortal and
 * DialogOverlay have no package equivalent, so they stay thin Radix wrappers
 * (same `radix-ui` instance the package uses).
 */

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-50 bg-black/80", className)}
      {...props}
    />
  );
}

function DialogContent({
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof UiDialogContent> & {
  showCloseButton?: boolean;
}) {
  return (
    <UiDialogContent
      // Silence Radix UI "Missing Description" warning globally.
      // Callers can still add <DialogDescription> when semantically useful.
      aria-describedby={undefined}
      hideClose={!showCloseButton}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
