"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useCreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";
import { useCreativeStudiosNavigation } from "@/hooks/components/curator/create/use-creative-studios-navigation";
import { catalogueCurator } from "@/lib/v2/curator/catalogue";
import {
  campusStep1Schema,
  type CampusStep1FormValues,
} from "@/lib/schemas/creative-studios/campus-step-1";

// Campus types and locations come from the backend (GET /campus-types, /locations).
const CAMPUS_TYPES_KEY = ["curator", "campus-types"] as const;
const LOCATIONS_KEY = ["curator", "locations"] as const;

export function useCampusStep1() {
  const { campus, updateCampus, serverErrors, clearServerError } =
    useCreativeStudiosFlowContext();
  const { data: campusTypes } = useQuery({
    queryKey: CAMPUS_TYPES_KEY,
    queryFn: catalogueCurator.campusTypes,
    staleTime: 30 * 60 * 1000,
  });
  const { data: locations } = useQuery({
    queryKey: LOCATIONS_KEY,
    queryFn: catalogueCurator.locations,
    staleTime: 10 * 60 * 1000,
  });
  const typeOptions = useMemo(
    () => (campusTypes ?? []).map((t) => t.label),
    [campusTypes],
  );
  const locationOptions = useMemo(
    () => (locations ?? []).map((l) => l.name),
    [locations],
  );
  const { goNext } = useCreativeStudiosNavigation("campus");
  const [nickError, setNickError] = useState("");
  const nickRef = useRef<HTMLInputElement>(null);

  const defaultValues = useMemo(
    (): CampusStep1FormValues => ({
      name: campus.name,
      motto: campus.motto,
      type: campus.type,
      location: campus.location,
    }),
    [campus.name, campus.motto, campus.type, campus.location],
  );

  const form = useForm<CampusStep1FormValues>({
    resolver: zodResolver(campusStep1Schema),
    defaultValues,
    mode: "onSubmit",
  });

  const { control, register, handleSubmit, formState, watch, reset } = form;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    const subscription = watch((values) => {
      updateCampus({
        name: values.name ?? "",
        motto: values.motto ?? "",
        type: values.type ?? "",
        location: values.location ?? "",
      });
    });

    return () => subscription.unsubscribe();
  }, [updateCampus, watch]);

  const addNick = useCallback(() => {
    const val = nickRef.current?.value.trim();
    if (!val) return;

    if (campus.nicks.some((n) => n.toLowerCase() === val.toLowerCase())) {
      setNickError("Already added");
      return;
    }

    updateCampus({ nicks: [...campus.nicks, val] });
    if (nickRef.current) nickRef.current.value = "";
    setNickError("");
    clearServerError("nicknames");
  }, [campus.nicks, updateCampus, clearServerError]);

  const rmNick = useCallback(
    (index: number) => {
      updateCampus({ nicks: campus.nicks.filter((_, idx) => idx !== index) });
    },
    [campus.nicks, updateCampus],
  );

  const onSubmit = handleSubmit((values) => {
    clearServerError("fullName");
    updateCampus({
      name: values.name.trim(),
      motto: values.motto,
      type: values.type,
      location: values.location,
    });
    goNext();
  });

  return {
    control,
    register,
    errors: formState.errors,
    nickError: nickError || serverErrors.nicknames || "",
    // Server field problems from the last create (e.g. NAME_TAKEN on fullName).
    serverErrors: {
      name: serverErrors.fullName,
      motto: serverErrors.motto,
      type: serverErrors.type,
      location: serverErrors.locationId,
    } as Partial<Record<"name" | "motto" | "type" | "location", string>>,
    nickRef,
    addNick,
    rmNick,
    nicks: campus.nicks,
    onSubmit,
    typeOptions,
    locationOptions,
  };
}
