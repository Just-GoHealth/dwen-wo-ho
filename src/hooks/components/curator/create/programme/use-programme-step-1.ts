"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";
import { useCreativeStudiosNavigation } from "@/hooks/components/curator/create/use-creative-studios-navigation";
import {
  getProgrammeYearFromOptions,
  getProgrammeYearToOptions,
  reconcileProgrammeYearFrom,
  reconcileProgrammeYears,
  reconcileProgrammeYearTo,
} from "@/lib/utils/curator/create/reconcile-programme-years";

function clearDurationError(
  errors: Record<string, string>,
): Record<string, string> {
  if (!errors.dur) return errors;
  const next = { ...errors };
  delete next.dur;
  return next;
}

export function useProgrammeStep1() {
  const { programme, updateProgramme, serverErrors } =
    useCreativeStudiosFlowContext();
  const { goNext } = useCreativeStudiosNavigation("programme");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nickRef = useRef<HTMLInputElement>(null);
  const programmeRef = useRef(programme);

  programmeRef.current = programme;

  const yearFromOptions = useMemo(() => getProgrammeYearFromOptions(), []);

  const yearToOptions = useMemo(
    () => getProgrammeYearToOptions(programme.durationFromYear),
    [programme.durationFromYear],
  );

  useEffect(() => {
    const { durationFromYear, durationToYear } = reconcileProgrammeYears(
      programme.durationFromYear,
      programme.durationToYear,
    );
    if (
      durationFromYear !== programme.durationFromYear ||
      durationToYear !== programme.durationToYear
    ) {
      updateProgramme({ durationFromYear, durationToYear });
    }
  }, [programme.durationFromYear, programme.durationToYear, updateProgramme]);

  const setField = (field: keyof typeof programme, value: string | number) => {
    updateProgramme({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const setYearFrom = (durationFromYear: number) => {
    updateProgramme(
      reconcileProgrammeYearFrom(durationFromYear, programme.durationToYear),
    );
    setErrors((prev) => clearDurationError(prev));
  };

  const setYearTo = (durationToYear: number) => {
    updateProgramme(
      reconcileProgrammeYearTo(programme.durationFromYear, durationToYear),
    );
    setErrors((prev) => clearDurationError(prev));
  };

  const addNick = () => {
    const val = nickRef.current?.value.trim();
    if (!val) return;
    if (programme.nicks.some((n) => n.toLowerCase() === val.toLowerCase())) {
      setErrors({ ...errors, nick: "Already added" });
      return;
    }
    updateProgramme({ nicks: [...programme.nicks, val] });
    if (nickRef.current) nickRef.current.value = "";
    setErrors((prev) => {
      const next = { ...prev };
      delete next.nick;
      return next;
    });
  };

  const rmNick = (index: number) => {
    updateProgramme({
      nicks: programme.nicks.filter((_, idx) => idx !== index),
    });
  };

  const validate = useCallback(() => {
    const current = programmeRef.current;
    const nextErrors: Record<string, string> = {};
    const name = current.name.trim();
    if (!name) nextErrors.name = "Full name is required";
    if (current.durationFromYear > current.durationToYear) {
      nextErrors.dur = '"To" year cannot be before "From" year';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, []);

  const handleNext = useCallback(() => {
    if (!validate()) return;
    goNext();
  }, [goNext, validate]);

  // Server field problems from the last create (NAME_TAKEN, VALIDATION) show
  // beside the matching inputs until the form's own validation replaces them.
  const mergedErrors = useMemo(() => {
    const fromServer: Record<string, string> = {};
    if (serverErrors.fullName) fromServer.name = serverErrors.fullName;
    if (serverErrors.nicknames) fromServer.nick = serverErrors.nicknames;
    if (serverErrors.defaultYears) fromServer.dur = serverErrors.defaultYears;
    return { ...fromServer, ...errors };
  }, [errors, serverErrors]);

  return {
    programme,
    errors: mergedErrors,
    nickRef,
    setField,
    setYearFrom,
    setYearTo,
    addNick,
    rmNick,
    handleNext,
    yearFromOptions,
    yearToOptions,
  };
}
