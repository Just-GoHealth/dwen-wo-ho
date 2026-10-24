"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useCreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";
import { useCreativeStudiosSubmit } from "@/hooks/components/curator/create/use-creative-studios-submit";

export function useTagForm() {
  const { tag, updateTag, submitTag, serverErrors } =
    useCreativeStudiosFlowContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const tagRef = useRef<HTMLInputElement>(null);

  const setMainTitle = (val: string) => {
    updateTag({ mainTitle: val });
    if (errors.mainTitle) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.mainTitle;
        return next;
      });
    }
  };

  const addTag = () => {
    const val = tagRef.current?.value.trim();
    if (!val) return;
    if (tag.tags.some((t) => t.toLowerCase() === val.toLowerCase())) {
      setErrors({ ...errors, tag: "Already in this tag group" });
      return;
    }
    updateTag({ tags: [...tag.tags, val] });
    if (tagRef.current) tagRef.current.value = "";
    setErrors((prev) => {
      const next = { ...prev };
      delete next.tag;
      return next;
    });
  };

  const rmTag = (index: number) => {
    updateTag({ tags: tag.tags.filter((_, idx) => idx !== index) });
  };

  const mvTag = (index: number, dir: number) => {
    const nextIndex = index + dir;
    if (nextIndex < 0 || nextIndex >= tag.tags.length) return;
    const nextTags = [...tag.tags];
    [nextTags[index], nextTags[nextIndex]] = [
      nextTags[nextIndex],
      nextTags[index],
    ];
    updateTag({ tags: nextTags });
  };

  const validate = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    const mainTitle = tag.mainTitle.trim();
    if (!mainTitle) nextErrors.mainTitle = "Main title is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [tag.mainTitle]);

  const submitWithValidation = useCallback(() => {
    if (!validate()) return false;
    return submitTag();
  }, [submitTag, validate]);

  const { isSubmitting, handleSubmit } =
    useCreativeStudiosSubmit(submitWithValidation);

  // Server field problems: NAME_TAKEN on `title`, VALIDATION on `options`.
  const mergedErrors = useMemo(() => {
    const fromServer: Record<string, string> = {};
    if (serverErrors.title) fromServer.mainTitle = serverErrors.title;
    const optionsError = Object.entries(serverErrors).find(([field]) =>
      field.startsWith("options"),
    )?.[1];
    if (optionsError) fromServer.tag = optionsError;
    return { ...fromServer, ...errors };
  }, [errors, serverErrors]);

  return {
    tag,
    errors: mergedErrors,
    tagRef,
    setMainTitle,
    addTag,
    rmTag,
    mvTag,
    validate,
    isSubmitting,
    handleCreate: handleSubmit,
  };
}
