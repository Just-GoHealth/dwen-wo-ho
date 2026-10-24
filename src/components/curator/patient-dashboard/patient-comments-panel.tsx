"use client";

import { useState } from "react";
import { MessageSquare, Clock, Send } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import type { PatientCommentsPanelProps } from "@/lib/types/components/curator/patient-dashboard";

const COMMENT_MAX = 2000;

/**
 * The result's comment thread (GET/POST /results/{id}/comments). Replaces
 * v1's "Actions History"; v2 has no patient-actions endpoints.
 */
export default function PatientCommentsPanel({
  comments,
  isLoading,
  onAddComment,
  isAdding,
  bodyError,
}: PatientCommentsPanelProps) {
  const [draft, setDraft] = useState("");

  const submit = async () => {
    const body = draft.trim();
    if (!body) return;
    try {
      await onAddComment(body);
      setDraft("");
    } catch {
      // Toasted by the mutation; `bodyError` shows below the field.
    }
  };

  return (
    <div className="bg-card border-border flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm">
      <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
        <h2 className="text-foreground mb-6 text-lg font-bold">Comments</h2>

        <div className="scrollbar-thumb-border flex-1 scrollbar-thin space-y-3 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-xs">
              No comments yet
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="hover:bg-muted/50 hover:border-border group flex gap-4 rounded-xl border border-transparent p-3 transition-colors"
              >
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm break-words whitespace-pre-line">
                    {comment.body}
                  </p>
                  <div className="text-muted-foreground mt-1 flex items-center gap-1 text-[10px]">
                    <Clock className="h-3 w-3" />
                    <p className="pt-0.5">
                      {new Date(comment.at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-border bg-muted/10 mt-auto space-y-2 border-t p-4">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={COMMENT_MAX}
          rows={3}
          aria-invalid={!!bodyError}
          placeholder="Add a comment"
          className="resize-none"
        />
        {bodyError && (
          <p role="alert" className="text-destructive text-xs font-medium">
            {bodyError}
          </p>
        )}
        <LoadingButton
          type="button"
          loading={isAdding}
          disabled={!draft.trim()}
          onClick={submit}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold"
        >
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" /> Post comment
          </span>
        </LoadingButton>
      </div>
    </div>
  );
}
