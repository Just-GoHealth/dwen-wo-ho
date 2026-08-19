"use client";

import { useState } from "react";
import Image from "next/image";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatProviderName } from "@/lib/utils/shared/provider-name";
import type { SchoolProvider } from "@/lib/types/entities/provider";

interface SchoolProvidersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providers: SchoolProvider[];
  campusLabel?: string | null;
}

function ProviderAvatar({
  provider,
  className,
}: {
  provider: SchoolProvider;
  className: string;
}) {
  return (
    <span
      className={`border-primary bg-muted relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 ${className}`}
    >
      {provider.profilePhotoURL ? (
        <Image
          src={provider.profilePhotoURL}
          alt={provider.providerName}
          fill
          className="object-cover"
        />
      ) : (
        <span className="text-muted-foreground text-lg font-bold">
          {provider.providerName?.charAt(0).toUpperCase() || "P"}
        </span>
      )}
    </span>
  );
}

/**
 * The school's provider roster as a self-contained floating sheet — matches
 * `.pv-back`/`.pv`/`.pv-hd`/`.pv-list`/`.pv-row`/`.pv-one` in
 * guide/Bronze Fury A_33.html: a list of provider rows that slides, in
 * place, to a detail view on click (no separate route/modal). The mock's
 * detail view shows fabricated stat chips (patients/911/load%) with no
 * backing data on `SchoolProvider` — this shows only real fields instead
 * (specialty, email, phone, application status). Adding a provider stays
 * on its existing Creative Studios flow rather than the mock's in-sheet
 * add-mode, since that flow has real backend wiring this doesn't.
 */
export function SchoolProvidersSheet({
  open,
  onOpenChange,
  providers,
  campusLabel,
}: SchoolProvidersSheetProps) {
  const [selected, setSelected] = useState<SchoolProvider | null>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setSelected(null);
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        showCloseButton={!selected}
        className="bg-card/95 border-primary/30 flex h-[70vh] max-h-[640px] w-[95vw] max-w-[480px] min-w-[340px] flex-col gap-0 overflow-hidden rounded-[20px] border p-0 shadow-2xl backdrop-blur-[18px]"
      >
        <VisuallyHidden.Root>
          <DialogTitle>School Providers</DialogTitle>
        </VisuallyHidden.Root>

        {!selected ? (
          <>
            <div className="border-border/60 flex min-h-[15%] flex-col gap-1 border-b border-dashed px-6 py-5">
              <h3 className="text-foreground text-2xl font-extrabold">
                {providers.length}{" "}
                <i className="text-muted-foreground not-italic">Providers</i>
              </h3>
              <span className="text-muted-foreground/70 text-xs font-bold tracking-[.1em] uppercase">
                {campusLabel || "On this campus"}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2">
              {providers.length === 0 ? (
                <p className="text-muted-foreground py-10 text-center text-sm">
                  No providers on this campus yet.
                </p>
              ) : (
                providers.map((provider) => (
                  <button
                    key={provider.email}
                    type="button"
                    onClick={() => setSelected(provider)}
                    className="group hover:bg-foreground/5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                  >
                    <ProviderAvatar provider={provider} className="size-14" />
                    <span className="min-w-0 flex-1">
                      <b className="text-foreground block truncate text-[15px] font-bold">
                        {formatProviderName(
                          provider.providerName,
                          provider.providerTitle,
                        )}
                      </b>
                      <i className="text-muted-foreground block truncate text-[12.5px] font-medium not-italic">
                        {provider.specialty || "Provider"}
                      </i>
                    </span>
                    <span className="text-primary flex shrink-0 translate-x-1 items-center gap-1 text-[13px] font-bold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                      Open
                      <ChevronRight className="size-3.5" />
                    </span>
                  </button>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-6 py-4 text-sm font-bold"
            >
              <ChevronLeft className="size-4" /> Providers
            </button>

            <div className="flex flex-1 flex-col items-center gap-3 overflow-y-auto px-6 pb-8 text-center">
              <ProviderAvatar
                provider={selected}
                className="size-28 text-3xl shadow-lg"
              />

              <h4 className="text-foreground text-xl font-extrabold">
                {formatProviderName(
                  selected.providerName,
                  selected.providerTitle,
                )}
              </h4>
              <p className="text-muted-foreground text-sm font-medium">
                {selected.specialty || "Provider"}
              </p>

              <div className="mt-2 grid w-full grid-cols-1 gap-2 text-left">
                {selected.email && (
                  <div className="bg-muted/40 rounded-lg px-3 py-2">
                    <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
                      Email
                    </p>
                    <p className="text-foreground text-sm">{selected.email}</p>
                  </div>
                )}
                {selected.officePhoneNumber && (
                  <div className="bg-muted/40 rounded-lg px-3 py-2">
                    <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
                      Phone
                    </p>
                    <p className="text-foreground text-sm">
                      {selected.officePhoneNumber}
                    </p>
                  </div>
                )}
                {selected.applicationStatus && (
                  <div className="bg-muted/40 rounded-lg px-3 py-2">
                    <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
                      Status
                    </p>
                    <p className="text-foreground text-sm capitalize">
                      {selected.applicationStatus.toLowerCase()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
