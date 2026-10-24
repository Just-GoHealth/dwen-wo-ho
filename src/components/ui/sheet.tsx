"use client";

import * as React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent as UiSheetContent,
  SheetDescription as UiSheetDescription,
  SheetHeader as UiSheetHeader,
  SheetTitle as UiSheetTitle,
  SheetTrigger,
} from "@just-gohealth/ui";

import { cn } from "@/lib/utils";

/*
 * Backed by `@just-gohealth/ui`'s Sheet family. The app's sheets pad their
 * own header/body, so the package panel padding is reset here; SheetFooter
 * has no package equivalent and stays local.
 */

function SheetContent({
  className,
  ...props
}: React.ComponentProps<typeof UiSheetContent>) {
  return (
    <UiSheetContent
      // Silence Radix UI "Missing Description" warning globally.
      aria-describedby={undefined}
      className={cn("p-0 sm:p-0", className)}
      {...props}
    />
  );
}

function SheetHeader({
  className,
  ...props
}: React.ComponentProps<typeof UiSheetHeader>) {
  return <UiSheetHeader className={cn("p-4", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof UiSheetTitle>) {
  return (
    <UiSheetTitle
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof UiSheetDescription>) {
  return (
    <UiSheetDescription
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
