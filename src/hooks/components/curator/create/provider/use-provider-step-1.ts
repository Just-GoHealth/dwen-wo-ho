"use client";

import { useMemo, useRef, useState } from "react";
import { useCreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";

export function useProviderStep1() {
  const { provider, updateProvider, serverErrors } =
    useCreativeStudiosFlowContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nickRef = useRef<HTMLInputElement>(null);

  const setField = (field: keyof typeof provider, value: string | boolean) => {
    updateProvider({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const addNick = () => {
    const val = nickRef.current?.value.trim();
    if (!val) return;
    if (provider.nicks.some((n) => n.toLowerCase() === val.toLowerCase())) {
      setErrors({ ...errors, nick: "Already added" });
      return;
    }
    updateProvider({ nicks: [...provider.nicks, val] });
    if (nickRef.current) nickRef.current.value = "";
    setErrors((prev) => {
      const next = { ...prev };
      delete next.nick;
      return next;
    });
  };

  const rmNick = (index: number) => {
    updateProvider({ nicks: provider.nicks.filter((_, idx) => idx !== index) });
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const name = provider.name.trim();
    if (!name) nextErrors.name = "Full name is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Server field problems from the last create (e.g. NAME_TAKEN on nicknames).
  const mergedErrors = useMemo(() => {
    const fromServer: Record<string, string> = {};
    if (serverErrors.fullName) fromServer.name = serverErrors.fullName;
    if (serverErrors.nicknames) fromServer.nick = serverErrors.nicknames;
    if (serverErrors.bio) fromServer.bio = serverErrors.bio;
    return { ...fromServer, ...errors };
  }, [errors, serverErrors]);

  return {
    provider,
    errors: mergedErrors,
    nickRef,
    setField,
    addNick,
    rmNick,
    validate,
  };
}
