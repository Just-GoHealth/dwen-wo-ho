"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/infra/routes";
import {
  AssociatedSchool,
  AssociatedProvider,
} from "@/lib/types/entities/partners";

export const usePartnerPanelState = () => {
  const router = useRouter();

  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState("");

  // The campus page is the campus's hub now; open it instead of the old edit modal.
  const handleSchoolClick = useCallback(
    (school: AssociatedSchool) => {
      router.push(`${ROUTES.curator.schools}/${String(school.id)}`);
    },
    [router],
  );

  const handleProviderClick = useCallback((provider: AssociatedProvider) => {
    setSelectedProviderId(provider.id);
    setShowProviderModal(true);
  }, []);

  return {
    showProviderModal,
    setShowProviderModal,
    selectedProviderId,
    setSelectedProviderId,
    handleSchoolClick,
    handleProviderClick,
  };
};
