"use client";

import { useState, useMemo } from "react";
import { useProvidersQuery } from "@/hooks/queries/use-provider";
import { useCampusOptions } from "@/hooks/curator/providers/use-campus-options";
import { AssociatedSchool } from "@/lib/types/entities/partners";
import { ProviderDetails } from "@/lib/types/entities/provider";
import { toast } from "sonner";

export const useProviderPanelSchools = (
  isOpen: boolean,
  providerId: string,
  provider: ProviderDetails | null,
) => {
  const {
    addSchoolToProvider,
    removeSchoolFromProvider,
    isAddingSchool,
    isRemovingSchool,
  } = useProvidersQuery({
    enabled: false,
  });
  const { data: allSchools = [] } = useCampusOptions({ enabled: isOpen });

  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [schoolToAdd, setSchoolToAdd] = useState<AssociatedSchool | null>(null);
  const [schoolToRemove, setSchoolToRemove] = useState<AssociatedSchool | null>(
    null,
  );

  // TODO(v2-backend): no "campuses this provider serves" endpoint (v1 returned
  // them on GET /curator/providers/{id}); only GET /campuses/{id}/providers.
  const associatedSchools: AssociatedSchool[] = useMemo(() => [], []);

  // Without the associations every campus is offered; adding one the provider
  // already serves is harmless (the backend re-attaches).
  const availableSchools: AssociatedSchool[] = allSchools;

  const filteredAvailableSchools = useMemo(() => {
    if (!schoolSearchQuery.trim()) return availableSchools;
    const query = schoolSearchQuery.toLowerCase();
    return availableSchools.filter((school) =>
      school.name.toLowerCase().includes(query),
    );
  }, [availableSchools, schoolSearchQuery]);

  const handleAddSchool = async (school: AssociatedSchool) => {
    if (provider?.applicationStatus !== "APPROVED") {
      // The backend answers 422 PROVIDER_NOT_APPROVED; say it up front.
      toast.error("Only approved providers can be added to a school");
      setSchoolToAdd(null);
      return;
    }
    await addSchoolToProvider({
      providerId: String(provider?.id || providerId),
      schoolId: String(school.id),
    });
    setSchoolToAdd(null);
  };

  const handleRemoveSchool = async (school: AssociatedSchool) => {
    await removeSchoolFromProvider({
      providerId: String(provider?.id || providerId),
      schoolId: String(school.id),
    });
    setSchoolToRemove(null);
  };

  return {
    associatedSchools,
    availableSchools,
    filteredAvailableSchools,
    schoolSearchQuery,
    setSchoolSearchQuery,
    schoolToAdd,
    setSchoolToAdd,
    schoolToRemove,
    setSchoolToRemove,
    isAddingSchool,
    isRemovingSchool,
    handleAddSchool,
    handleRemoveSchool,
  };
};
