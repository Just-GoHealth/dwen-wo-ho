// @vitest-environment happy-dom

import { describe, expect, it, beforeEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { ROUTES } from "@/lib/constants/infra/routes";
import type { School } from "@/lib/types/entities/school";
import { ApiError } from "@/lib/v2/http";

const toastError = vi.fn();

vi.mock("sonner", () => ({
  toast: { error: toastError, success: vi.fn() },
}));

const { useSchoolActions } = await import("./use-school-actions");

const school = {
  id: "c1a2b3c4-0000-4000-8000-000000000007",
  name: "North High",
} as unknown as School;

function setup(disableSchool: (id: string) => Promise<unknown>) {
  const router = { push: vi.fn() };
  const setShowDisableModal = vi.fn();
  const invalidateSchool = vi.fn().mockResolvedValue(undefined);

  const { result } = renderHook(() =>
    useSchoolActions(
      String(school.id),
      school,
      router as never,
      disableSchool,
      invalidateSchool,
      setShowDisableModal,
    ),
  );

  return { result, router, setShowDisableModal, invalidateSchool };
}

describe("useSchoolActions (LOG-04)", () => {
  beforeEach(() => {
    toastError.mockReset();
  });

  it("closes the modal and goes back to schools on success", async () => {
    const { result, router, setShowDisableModal } = setup(
      vi.fn().mockResolvedValue(undefined),
    );

    await act(() => result.current.handleDisableConfirm());

    expect(setShowDisableModal).toHaveBeenCalledWith(false);
    expect(router.push).toHaveBeenCalledWith(ROUTES.curator.schools);
    expect(toastError).not.toHaveBeenCalled();
    expect(result.current.isActionLoading).toBe(false);
  });

  it("shows the error and keeps the modal open on failure", async () => {
    const { result, router, setShowDisableModal } = setup(
      vi.fn().mockRejectedValue(
        new ApiError({
          status: 404,
          code: "NOT_FOUND",
          detail: "We couldn't find that campus.",
        }),
      ),
    );

    await act(() => result.current.handleDisableConfirm());

    expect(toastError).toHaveBeenCalledWith("We couldn't find that campus.");
    expect(setShowDisableModal).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
    expect(result.current.isActionLoading).toBe(false);
  });

  it("falls back to a generic message when the error has none", async () => {
    const { result } = setup(vi.fn().mockRejectedValue({}));

    await act(() => result.current.handleDisableConfirm());

    expect(toastError).toHaveBeenCalledWith(expect.any(String));
    expect(toastError.mock.calls[0][0].length).toBeGreaterThan(0);
  });

  it("does nothing without a school", async () => {
    const disableSchool = vi.fn();
    const router = { push: vi.fn() };
    const { result } = renderHook(() =>
      useSchoolActions(
        "7",
        null,
        router as never,
        disableSchool,
        vi.fn(),
        vi.fn(),
      ),
    );

    await act(() => result.current.handleDisableConfirm());

    expect(disableSchool).not.toHaveBeenCalled();
  });

  it("invalidates the school after an update", async () => {
    const { result, invalidateSchool } = setup(vi.fn());

    await act(() => result.current.handleSchoolUpdated());

    expect(invalidateSchool).toHaveBeenCalledWith(String(school.id));
  });
});
