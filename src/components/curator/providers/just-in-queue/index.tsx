"use client";

import { FiCheck, FiX } from "react-icons/fi";
import { LoadingButton } from "@/components/ui/loading-button";
import { useJustInQueue } from "@/hooks/curator/providers/use-just-in";
import { formatProviderName } from "@/lib/utils/shared/provider-name";
import { timeAgo } from "@/lib/utils/shared/time-ago";

/** Pending requests from approved providers to join a campus or host. */
export default function JustInQueue() {
  const { requests, isLoading, decide, decidingId } = useJustInQueue();

  if (isLoading || requests.length === 0) return null;

  return (
    <section className="bg-card border-border rounded-xl border p-4 shadow-sm sm:p-6">
      <h2 className="mb-1 text-lg font-bold">Just In</h2>
      <p className="text-muted-foreground mb-4 text-sm">
        Providers asking to join a school or partner
      </p>
      <ul className="flex flex-col gap-3">
        {requests.map((request) => {
          const busy = decidingId === request.id;
          return (
            <li
              key={request.id}
              className="border-border flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {request.applicant
                    ? formatProviderName(
                        request.applicant.fullName,
                        request.applicant.title,
                      )
                    : "Provider"}
                </p>
                <p className="text-muted-foreground truncate text-sm">
                  {request.kind === "JOIN_HOST" ? "Partner" : "School"}:{" "}
                  {request.target?.name ?? "Unknown"} ·{" "}
                  {timeAgo(request.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <LoadingButton
                  onClick={() => decide({ id: request.id, approve: true })}
                  loading={busy}
                  disabled={!!decidingId}
                  className="border-success/40 bg-success/20 text-success hover:bg-success/30 flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold sm:flex-none"
                >
                  <FiCheck className="h-4 w-4" />
                  Approve
                </LoadingButton>
                <LoadingButton
                  onClick={() => decide({ id: request.id, approve: false })}
                  disabled={!!decidingId}
                  className="border-destructive/40 bg-destructive/20 text-destructive hover:bg-destructive/30 flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold sm:flex-none"
                >
                  <FiX className="h-4 w-4" />
                  Decline
                </LoadingButton>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
