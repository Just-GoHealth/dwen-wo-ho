"use client";

import { useState } from "react";
import { Copy, Download, Plus, Ban } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useAccessCodesQuery from "@/hooks/curator/competitions/use-access-codes";
import type { AccessCodeStatus } from "@/lib/types/api/competitions";
import { cn } from "@/lib/utils";

interface SchoolAccessCodesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: number | null;
  teamName: string;
}

const STATUS_TABS: { key: AccessCodeStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "ISSUED", label: "Issued" },
  { key: "REDEEMED", label: "Redeemed" },
  { key: "REVOKED", label: "Revoked" },
];

const STATUS_BADGE_CLASS: Record<AccessCodeStatus, string> = {
  ISSUED: "bg-primary/15 text-primary border-primary/30",
  REDEEMED: "bg-success/15 text-success border-success/30",
  REVOKED: "bg-destructive/15 text-destructive border-destructive/30",
};

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Access codes management for a team — matches the mock's two-pane
 * "Standing codes"/"Generated" split (guide/Bronze Fury A_33.html `.ac`),
 * updated for the real API's three-state lifecycle (ISSUED/REDEEMED/
 * REVOKED) instead of the mock's simple used/unused binary. Shared between
 * the school-detail page (this call site) and the Competitions team-detail
 * page — same teamId, same data.
 */
export function SchoolAccessCodesSheet({
  open,
  onOpenChange,
  teamId,
  teamName,
}: SchoolAccessCodesSheetProps) {
  const [statusTab, setStatusTab] = useState<AccessCodeStatus | "ALL">("ALL");
  const [showGenerate, setShowGenerate] = useState(false);
  const [count, setCount] = useState(5);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState("");

  const {
    useAccessCodes,
    mintAccessCodes,
    isMinting,
    revokeAccessCode,
    isRevoking,
    exportAccessCodes,
  } = useAccessCodesQuery();

  const { data: codes = [], isLoading } = useAccessCodes(
    teamId ?? "",
    statusTab === "ALL" ? undefined : statusTab,
    { enabled: !!teamId && open },
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleGenerate = async () => {
    if (!teamId) return;
    await mintAccessCodes({
      teamId,
      data: {
        count,
        seatLabels: Array.from({ length: count }, (_, i) => `Seat ${i + 1}`),
      },
    });
    setShowGenerate(false);
  };

  const handleRevoke = async () => {
    if (!teamId || !revokingId) return;
    await revokeAccessCode({
      teamId,
      codeId: revokingId,
      reason: revokeReason || "Revoked by curator",
    });
    setRevokingId(null);
    setRevokeReason("");
  };

  const handleExport = async () => {
    if (!teamId) return;
    const csv = await exportAccessCodes(teamId);
    downloadCsv(csv, `${teamName || "team"}-access-codes.csv`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Access Codes — {teamName}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          {!teamId ? (
            <p className="text-muted-foreground text-sm">
              This school isn&apos;t registered as a team in the current
              competition yet.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowGenerate((v) => !v)}
                  className="gap-1.5"
                >
                  <Plus className="size-3.5" />
                  Generate
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleExport}
                  className="gap-1.5"
                >
                  <Download className="size-3.5" />
                  Export CSV
                </Button>
              </div>

              {showGenerate && (
                <div className="border-border flex items-end gap-2 rounded-lg border p-3">
                  <div className="flex-1">
                    <Label htmlFor="ac-count">How many</Label>
                    <Input
                      id="ac-count"
                      type="number"
                      min={1}
                      max={50}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value) || 1)}
                    />
                  </div>
                  <LoadingButton
                    onClick={handleGenerate}
                    loading={isMinting}
                    loadingText="Generating..."
                  >
                    Generate
                  </LoadingButton>
                </div>
              )}

              <div className="flex items-center gap-1 overflow-x-auto">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusTab(tab.key)}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1 text-xs font-bold transition-colors",
                      statusTab === tab.key
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {isLoading &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))}

                {!isLoading && codes.length === 0 && (
                  <p className="text-muted-foreground py-6 text-center text-sm">
                    No codes here.
                  </p>
                )}

                {codes.map((c) => (
                  <div
                    key={c.id}
                    className="border-border flex items-center gap-2 rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold">
                          {c.code}
                        </span>
                        <Badge
                          className={cn(
                            "text-[10px] font-bold",
                            STATUS_BADGE_CLASS[c.status],
                          )}
                        >
                          {c.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground truncate text-xs">
                        {c.seatLabel}
                        {c.status === "REDEEMED" &&
                          c.redeemedByNickname &&
                          ` · redeemed by ${c.redeemedByNickname}`}
                        {c.status === "REVOKED" &&
                          c.revokeReason &&
                          ` · ${c.revokeReason}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(c.code)}
                      title="Copy"
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <Copy className="size-4" />
                    </button>
                    {c.status === "ISSUED" && (
                      <button
                        type="button"
                        onClick={() => setRevokingId(c.id)}
                        title="Revoke"
                        className="text-destructive/70 hover:text-destructive shrink-0"
                      >
                        <Ban className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {revokingId && (
                <div className="border-destructive/30 bg-destructive/5 flex items-end gap-2 rounded-lg border p-3">
                  <div className="flex-1">
                    <Label htmlFor="ac-reason">Reason for revoking</Label>
                    <Input
                      id="ac-reason"
                      value={revokeReason}
                      onChange={(e) => setRevokeReason(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  <LoadingButton
                    onClick={handleRevoke}
                    loading={isRevoking}
                    loadingText="Revoking..."
                    variant="destructive"
                  >
                    Revoke
                  </LoadingButton>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
