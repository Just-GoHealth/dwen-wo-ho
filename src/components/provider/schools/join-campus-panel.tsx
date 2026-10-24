"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { useJoinRequests } from "@/hooks/provider/join-requests/use-join-requests";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  PENDING: "bg-warning/10 text-warning",
  APPROVED: "bg-success/10 text-success",
  DECLINED: "bg-destructive/10 text-destructive",
} as const;

/** Search the public campus list and ask to join one; past requests below. */
export function JoinCampusPanel({ joinedIds }: { joinedIds: Set<string> }) {
  const {
    query,
    setQuery,
    campusResults,
    isSearching,
    requests,
    requestJoin,
    pendingTargetId,
  } = useJoinRequests();
  const pendingIds = new Set(
    requests.filter((r) => r.status === "PENDING").map((r) => r.target?.id),
  );

  return (
    <section className="bg-card border-border mt-8 space-y-4 rounded-2xl border p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-bold">Join a campus</h2>
        <p className="text-muted-foreground text-sm">
          Ask to serve another school. The JustGo team reviews each request.
        </p>
      </div>

      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search campuses"
          className="h-11 pl-9"
        />
      </div>

      {query.trim().length > 1 && (
        <ul className="divide-border divide-y">
          {isSearching && campusResults.length === 0 && (
            <li className="text-muted-foreground py-3 text-sm">Searching…</li>
          )}
          {campusResults.map((campus) => {
            const joined = joinedIds.has(campus.id);
            const requested = pendingIds.has(campus.id);
            return (
              <li
                key={campus.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {campus.fullName}
                  </p>
                  <p className="text-muted-foreground text-xs">{campus.type}</p>
                </div>
                <LoadingButton
                  size="sm"
                  variant={joined || requested ? "outline" : "default"}
                  disabled={joined || requested}
                  loading={pendingTargetId === campus.id}
                  onClick={() => requestJoin(campus.id)}
                  className="shrink-0 rounded-full"
                >
                  {joined ? "Joined" : requested ? "Requested" : "Ask to join"}
                </LoadingButton>
              </li>
            );
          })}
        </ul>
      )}

      {requests.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Your requests
          </h3>
          <ul className="space-y-2">
            {requests.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="truncate">{r.target?.name ?? "Campus"}</span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    STATUS_STYLE[r.status],
                  )}
                >
                  {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
