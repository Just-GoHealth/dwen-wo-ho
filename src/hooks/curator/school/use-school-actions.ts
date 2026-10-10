"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/infra/routes";
import { School } from "@/lib/types/entities/school";
import { getCleanErrorMessage } from "@/lib/utils/auth/error";

const DISABLE_SCHOOL_FAILED_MESSAGE =
  "Failed to disable school. Please try again.";

export function useSchoolActions(
  schoolId: string,
  school: School | null,
  router: ReturnType<typeof useRouter>,
  disableSchool: (id: string) => Promise<unknown>,
  invalidateSchool: (id: string) => Promise<unknown>,
  setShowDisableModal: (show: boolean) => void,
) {
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleSchoolUpdated = useCallback(async () => {
    await invalidateSchool(schoolId);
  }, [invalidateSchool, schoolId]);

  const handleDisableConfirm = useCallback(async () => {
    if (!school) return;
    setIsActionLoading(true);
    try {
      await disableSchool(String(school.id));
      setShowDisableModal(false);
      router.push(ROUTES.curator.schools);
    } catch (err: unknown) {
      // Keep the confirmation modal open so the curator can retry or cancel.
      toast.error(getCleanErrorMessage(err) || DISABLE_SCHOOL_FAILED_MESSAGE);
    } finally {
      setIsActionLoading(false);
    }
  }, [school, disableSchool, router, setShowDisableModal]);

  return {
    isActionLoading,
    handleSchoolUpdated,
    handleDisableConfirm,
  };
}
