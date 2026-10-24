"use client";

import { useState } from "react";
import type { Route } from "next";
import { ArrowLeft, Users, AlertTriangle } from "lucide-react";
import { MdSchool } from "react-icons/md";
import { TriageBadge } from "@just-gohealth/ui";
import { Button } from "@/components/ui/button";
import { ApiErrorNote } from "@/components/shared/api-error-note";
import { CareCaseSheet } from "@/components/provider/schools/care-case-sheet";
import { useProviderSchoolDetails } from "@/hooks/provider/school-details/use-school-details";
import { tierForResult } from "@/lib/utils/provider/campus-membership";
import { DYNAMIC_ROUTES, ROUTES } from "@/lib/constants/infra/routes";
import { compactTimeAgo } from "@/lib/utils/shared/time-ago";
import { cn } from "@/lib/utils";
import type { CareCase, Period } from "@/lib/v2/types";

const PERIODS: { label: string; value: Period | undefined; key: string }[] = [
  { label: "All", value: undefined, key: "ALL" },
  { label: "Today", value: "TODAY", key: "TODAY" },
  { label: "Week", value: "WEEK", key: "WEEK" },
  { label: "Month", value: "MONTH", key: "MONTH" },
  { label: "Year", value: "YEAR", key: "YEAR" },
];

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} variant="outline" className="w-fit">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Schools
    </Button>
  );
}

export default function ProviderSchoolDetailsPage() {
  const {
    router,
    school,
    results,
    total,
    summary,
    careCases,
    isLoading,
    notAvailable,
    loadError,
    period,
    setPeriod,
    activeOnly,
    setActiveOnly,
    clearCase,
    isClearing,
  } = useProviderSchoolDetails();
  const [openCase, setOpenCase] = useState<CareCase | null>(null);
  const back = () => router.push(ROUTES.provider.schools);

  if (isLoading) {
    return (
      <div className="bg-app-gradient flex min-h-screen items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  // 404 from the API: not attached to this campus (or not yet accepted).
  if (notAvailable) {
    return (
      <div className="bg-app-gradient min-h-screen p-4 sm:p-8">
        <BackButton onClick={back} />
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <MdSchool className="text-muted-foreground mb-4 h-16 w-16" />
          <h2 className="mb-2 text-xl font-semibold sm:text-2xl">
            This school isn&apos;t available to you
          </h2>
          <p className="text-muted-foreground max-w-sm text-sm">
            You can ask to join it from the Schools page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-app-gradient min-h-screen">
      <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
        <BackButton onClick={back} />

        <div className="flex items-center gap-4">
          {school?.logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization
            <img
              src={school.logo}
              alt={school.name}
              className="border-border size-16 shrink-0 rounded-2xl border object-cover sm:size-24"
            />
          ) : (
            <div className="bg-muted flex size-16 shrink-0 items-center justify-center rounded-2xl sm:size-24">
              <MdSchool className="text-muted-foreground size-8" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold sm:text-4xl">
              {school?.name ?? "School"}
            </h1>
            {school?.nickname && (
              <p className="text-muted-foreground">@{school.nickname}</p>
            )}
          </div>
        </div>

        <ApiErrorNote error={loadError} />

        {careCases.length > 0 && (
          <section className="bg-card border-border rounded-xl border p-4 sm:p-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <AlertTriangle className="size-5" />
              NSMQ care cases
            </h2>
            <ul className="divide-border divide-y">
              {careCases.map((c) => {
                const overdue =
                  !!c.respondBy &&
                  !c.clearedAt &&
                  new Date(c.respondBy).getTime() < Date.now();
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setOpenCase(c)}
                      className="hover:bg-muted/50 flex w-full items-center justify-between gap-3 rounded-lg px-2 py-3 text-left"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">
                          {c.studentName ?? c.initials}
                        </span>
                        {c.respondBy && !c.clearedAt && (
                          <span
                            className={cn(
                              "text-xs",
                              overdue
                                ? "text-destructive font-semibold"
                                : "text-muted-foreground",
                            )}
                          >
                            {overdue ? "Overdue" : "Respond by"}{" "}
                            {new Date(c.respondBy).toLocaleString()}
                          </span>
                        )}
                      </span>
                      {c.effectiveTag && (
                        <TriageBadge
                          level={c.effectiveTag}
                          active={!c.clearedAt}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section className="bg-card border-border rounded-xl border p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
              <Users className="size-5" />
              Students ({total})
            </h2>
            <label className="text-muted-foreground flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
              />
              Active only
            </label>
          </div>

          <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.value)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold",
                  period === p.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground",
                )}
              >
                {p.label}
                {summary
                  ? ` · ${summary.groups[p.key as keyof typeof summary.groups]}`
                  : ""}
              </button>
            ))}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">No results yet</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        DYNAMIC_ROUTES.provider.patientDetails(r.id) as Route,
                      )
                    }
                    className="bg-card border-border hover:border-primary/30 hover:bg-muted/50 flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left sm:p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-cyan-500 font-semibold text-white">
                        {r.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {r.displayName}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {[
                            r.yearLabel,
                            r.variant,
                            `${compactTimeAgo(r.createdAt)} ago`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        {r.respondBy && (
                          <p
                            className={cn(
                              "text-xs",
                              r.overdue
                                ? "text-destructive font-semibold"
                                : "text-muted-foreground",
                            )}
                          >
                            {r.overdue ? "Overdue" : "Respond by"}{" "}
                            {new Date(r.respondBy).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <TriageBadge level={tierForResult(r)} />
                      {!r.seen && (
                        <span className="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 text-[10px] font-semibold">
                          New
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <CareCaseSheet
        careCase={openCase}
        onClose={() => setOpenCase(null)}
        onClear={clearCase}
        isClearing={isClearing}
      />
    </div>
  );
}
