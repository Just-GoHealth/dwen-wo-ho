"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Trophy, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
 * Competitions entry screen — there's no endpoint that lists/creates
 * versions, only ones scoped by a version code the curator already knows,
 * so this is a code input + a locally-remembered "recent codes" list
 * rather than a real browsable index.
 */
export default function CompetitionsEntryPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

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
