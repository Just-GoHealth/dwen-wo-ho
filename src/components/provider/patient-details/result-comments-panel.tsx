"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import { ApiErrorNote } from "@/components/shared/api-error-note";
import { useApiError } from "@/hooks/shared/use-api-error";
import { compactTimeAgo } from "@/lib/utils/shared/time-ago";
import type { CommentView } from "@/lib/v2/types";

const MAX_COMMENT = 2000;

/** Comments on a result (`GET`/`POST /results/{id}/comments`), multi-line. */
export function ResultCommentsPanel({
  comments,
  isLoading,
  onAdd,
  isAdding,
  myAccountId,
}: {
  comments: CommentView[];
  isLoading: boolean;
  onAdd: (body: string) => Promise<unknown>;
  isAdding: boolean;
  myAccountId?: string;
}) {
  const [body, setBody] = useState("");
  const apiError = useApiError();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    apiError.clear();
    try {
      await onAdd(body.trim());
      setBody("");
    } catch (error) {
      apiError.capture(error);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <form onSubmit={submit} className="space-y-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={MAX_COMMENT}
          placeholder="Add a note for the care team"
          className="min-h-24 resize-none"
        />
        {apiError.fieldError("body") ? (
          <p className="text-destructive text-sm">
            {apiError.fieldError("body")}
          </p>
        ) : (
          <ApiErrorNote
            error={apiError.error}
            secondsLeft={apiError.secondsLeft}
          />
        )}
        <LoadingButton
          type="submit"
          loading={isAdding}
          disabled={!body.trim() || apiError.isRateLimited}
          className="w-full sm:w-auto"
        >
          Add comment
        </LoadingButton>
      </form>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading comments…</p>
        ) : comments.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-10 text-sm">
            <MessageSquare className="size-6" />
            No comments yet
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-card rounded-xl border p-3">
              <p className="text-muted-foreground mb-1 text-[11px] font-semibold">
                {c.authorAccountId === myAccountId ? "You" : "Care team"} ·{" "}
                {compactTimeAgo(c.at)} ago
              </p>
              <p className="text-sm whitespace-pre-wrap">{c.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
