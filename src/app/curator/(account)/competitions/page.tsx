"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Trophy, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useVersionsQuery from "@/hooks/curator/competitions/use-versions";
import { DYNAMIC_ROUTES } from "@/lib/constants/infra/routes";

const RECENT_KEY = "recent-competition-codes";

function loadRecentCodes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecentCode(code: string) {
  const existing = loadRecentCodes().filter((c) => c !== code);
  const next = [code, ...existing].slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

/**
 * Competitions entry screen: every version from GET /versions, plus a code
 * input and a locally-remembered "recent codes" list for quick jumps.
 */
export default function CompetitionsEntryPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const { useVersions } = useVersionsQuery();
  const { data: versions, isLoading: versionsLoading } = useVersions();

  useEffect(() => {
    setRecent(loadRecentCodes());
  }, []);

  const goToVersion = (versionCode: string) => {
    const trimmed = versionCode.trim();
    if (!trimmed) return;
    saveRecentCode(trimmed);
    router.push(DYNAMIC_ROUTES.curator.competitionDetails(trimmed) as Route);
  };

  return (
    <div className="bg-app-gradient min-h-screen px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 flex items-center gap-3">
          <Trophy className="text-primary size-8" />
          <div>
            <h1 className="text-foreground text-2xl font-extrabold tracking-tight">
              Competitions
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage teams, fixtures, and access codes for a competition season.
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToVersion(code);
          }}
          className="border-border flex items-center gap-2 rounded-xl border p-2"
        >
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Version code (e.g. NSMQ2026)"
            className="border-0 shadow-none focus-visible:ring-0"
          />
          <Button type="submit" disabled={!code.trim()} className="gap-1.5">
            Go
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <div className="mt-8">
          <p className="text-muted-foreground mb-2 text-xs font-bold tracking-[.1em] uppercase">
            All competitions
          </p>
          {versionsLoading && <Skeleton className="h-14 w-full rounded-xl" />}
          {!versionsLoading && (versions ?? []).length === 0 && (
            <p className="text-muted-foreground text-sm">
              No competitions yet.
            </p>
          )}
          <div className="flex flex-col gap-2">
            {(versions ?? []).map((v) => (
              <button
                key={v.code}
                type="button"
                onClick={() => goToVersion(v.code)}
                className="border-border bg-card/40 hover:border-primary/50 flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors"
              >
                <span className="min-w-0">
                  <span className="text-foreground block truncate font-extrabold">
                    {v.label}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {v.code}
                  </span>
                </span>
                <Badge variant="secondary">{v.status}</Badge>
              </button>
            ))}
          </div>
        </div>

        {recent.length > 0 && (
          <div className="mt-8">
            <p className="text-muted-foreground mb-2 text-xs font-bold tracking-[.1em] uppercase">
              Recent
            </p>
            <div className="flex flex-wrap gap-2">
              {recent.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => goToVersion(c)}
                  className="border-border text-foreground rounded-full border-[1.6px] border-dashed px-3.5 py-1.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:border-[var(--gold-hi)]"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
