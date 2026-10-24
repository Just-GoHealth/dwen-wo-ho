"use client";

import { SpecialtyStepProps } from "@/lib/types/components/provider/auth";
import { useRoleCategories } from "@/hooks/queries/use-provider-me";

/** Role groups come from `GET /role-categories`; the value is the category id. */
export const useSpecialtyStep = ({
  specialty,
  onChange,
}: SpecialtyStepProps) => {
  const { data: categories = [], isLoading } = useRoleCategories();

  const handleSpecialtySelect = (categoryId: string) => {
    onChange("specialty", specialty === categoryId ? "" : categoryId);
  };

  return {
    selectedSpecialty: specialty,
    handleSpecialtySelect,
    specialties: categories,
    isLoadingSpecialties: isLoading,
  };
};
