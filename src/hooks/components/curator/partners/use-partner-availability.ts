"use client";

import { useMemo } from "react";
import {
  AssociatedSchool,
  AssociatedProvider,
} from "@/lib/types/entities/partners";
import { Provider } from "@/lib/types/entities/provider";

interface UsePartnerAvailabilityProps {
  allSchools: AssociatedSchool[];
  providersList: Provider[];
  associatedSchools: AssociatedSchool[];
  associatedProviders: AssociatedProvider[];
}

export const usePartnerAvailability = ({
  allSchools,
  providersList,
  associatedSchools,
  associatedProviders,
}: UsePartnerAvailabilityProps) => {
  const availableSchools = useMemo(() => {
    const associatedSchoolIds = new Set(
      associatedSchools.map((s) => String(s.id)),
    );
    return allSchools.flatMap((s) =>
      associatedSchoolIds.has(String(s.id))
        ? []
        : [{ id: s.id, name: s.name, logo: s.logo || undefined }],
    );
  }, [allSchools, associatedSchools]);

  const availableProviders = useMemo(() => {
    const associatedProviderIds = new Set(associatedProviders.map((p) => p.id));
    return providersList.flatMap((p) =>
      associatedProviderIds.has(p.id)
        ? []
        : [
            {
              id: p.id,
              email: p.email,
              providerName: p.providerName ?? "",
              providerTitle: p.providerTitle ?? undefined,
              specialty: p.specialty ?? undefined,
              profilePhotoURL: p.profilePhotoURL ?? undefined,
            },
          ],
    );
  }, [providersList, associatedProviders]);

  return {
    availableSchools,
    availableProviders,
  };
};
