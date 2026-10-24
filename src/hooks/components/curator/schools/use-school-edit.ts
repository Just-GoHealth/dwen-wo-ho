"use client";

import { useState, useRef } from "react";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import { useCampusReference } from "@/hooks/curator/schools/use-campus-reference";
import type { CuratorSchool } from "@/lib/types/components/curator/schools/campus";
import type { SchoolEditFormData } from "@/lib/types/components/curator/schools/schools";
import type { UpdateSchoolInput } from "@/services/curator/schools";
import { fieldMessage } from "@/lib/v2/curator/errors";

function seedForm(school: CuratorSchool | undefined): SchoolEditFormData {
  return {
    name: school?.name || "",
    nickname: school?.nickname || "",
    motto: school?.motto || "",
    type: school?.type || "",
    locationId: school?.locationId ?? "",
  };
}

/** Only what changed, plus the version the form was loaded at (409 STALE otherwise). */
function buildPatch(
  school: CuratorSchool,
  form: SchoolEditFormData,
): UpdateSchoolInput {
  const patch: UpdateSchoolInput = {
    id: school.id,
    version: school.version ?? 0,
  };
  if (form.name.trim() !== school.name) patch.fullName = form.name.trim();
  if (form.nickname.trim() !== (school.nickname ?? "")) {
    // The first nickname is the one the screens show; the rest stay.
    const rest = (school.nicknames ?? []).slice(1);
    patch.nicknames = form.nickname.trim()
      ? [form.nickname.trim(), ...rest]
      : rest;
  }
  // "" clears the motto.
  if (form.motto !== (school.motto ?? "")) patch.motto = form.motto.trim();
  if (form.type !== school.type) patch.type = form.type;
  if (form.locationId && form.locationId !== school.locationId) {
    patch.locationId = form.locationId;
  }
  return patch;
}

export const useSchoolEdit = ({
  school,
  onClose,
  onSchoolUpdated,
  onDisableSchool,
}: {
  school: CuratorSchool;
  onClose: () => void;
  onSchoolUpdated?: () => void;
  onDisableSchool?: () => void;
}) => {
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [formData, setFormData] = useState<SchoolEditFormData>(() =>
    seedForm(school),
  );

  const { updateSchool, isUpdating, updateSchoolError, resetUpdateSchool } =
    useSchoolsQuery();
  const updateSchoolMutation = { mutate: updateSchool, isPending: isUpdating };
  const { campusTypes, locations } = useCampusReference();
  const campusDropdownRef = useRef<HTMLDivElement>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Re-seed the form while rendering when a different school (or a newer
  // version of it, after a 409 STALE reload) arrives, instead of mirroring
  // the prop into state via an effect.
  const [prevSchool, setPrevSchool] = useState(school);
  if (school !== prevSchool) {
    setPrevSchool(school);
    if (school) {
      setFormData(seedForm(school));
      setHasChanges(false);
    }
  }

  const handleInputChange = (
    field: keyof SchoolEditFormData,
    value: string,
  ) => {
    const processedValue = field === "motto" ? value.toUpperCase() : value;
    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
    setHasChanges(true);
  };

  const handleLocationSelect = (locationId: string) => {
    handleInputChange("locationId", locationId);
    setShowCampusDropdown(false);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.type) {
      return;
    }

    resetUpdateSchool();
    try {
      await updateSchoolMutation.mutate(buildPatch(school, formData));
      onSchoolUpdated?.();
      onClose();
    } catch {
      // Toasted by the mutation; field problems show beside the fields.
    }
  };

  const handleDisable = () => {
    onClose();
    onDisableSchool?.();
  };

  const selectedLocation = locations.find((l) => l.id === formData.locationId);

  return {
    showCampusDropdown,
    setShowCampusDropdown,
    formData,
    campusTypes,
    locations,
    selectedLocationName: selectedLocation?.name ?? school?.locationName ?? "",
    updateSchoolMutation,
    campusDropdownRef,
    hasChanges,
    fieldError: (field: string) => fieldMessage(updateSchoolError, field),
    handleInputChange,
    handleLocationSelect,
    handleSubmit,
    handleDisable,
  };
};
