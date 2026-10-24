import { describe, expect, it, vi } from "vitest";

const toastError = vi.hoisted(() => vi.fn());
vi.mock("sonner", () => ({ toast: { error: toastError } }));

import { ApiError, SYSTEM_ERROR_MESSAGE } from "@/lib/v2/http";
import {
  curatorErrorMessage,
  fieldMessage,
  hasCode,
  isStale,
  toastCuratorError,
} from "./errors";

const problem = (code: string, status = 409, extra = {}) =>
  new ApiError({ status, code, detail: `detail for ${code}`, ...extra });

describe("curator error helpers", () => {
  it("shows the server's detail for curator codes", () => {
    expect(curatorErrorMessage(problem("TEAM_HAS_MEMBERS"))).toBe(
      "detail for TEAM_HAS_MEMBERS",
    );
    expect(hasCode(problem("REQUEST_DECIDED"), "REQUEST_DECIDED")).toBe(true);
    expect(hasCode(new Error("x"), "REQUEST_DECIDED")).toBe(false);
  });

  it("explains STALE as a reload", () => {
    expect(isStale(problem("STALE"))).toBe(true);
    expect(curatorErrorMessage(problem("STALE"))).toMatch(/latest version/);
  });

  it("falls back for non-API errors and 5xx", () => {
    expect(curatorErrorMessage(new Error("boom"), "Couldn't save")).toBe(
      "Couldn't save",
    );
    expect(curatorErrorMessage(new ApiError({ status: 500 }))).toBe(
      SYSTEM_ERROR_MESSAGE,
    );
  });

  it("reads field errors", () => {
    const error = problem("NAME_TAKEN", 409, {
      fields: [{ field: "fullName", message: "Already a campus" }],
    });
    expect(fieldMessage(error, "fullName")).toBe("Already a campus");
    expect(fieldMessage(error, "motto")).toBeUndefined();
    expect(fieldMessage(new Error("x"), "fullName")).toBeUndefined();
  });

  it("reloads on STALE before toasting", () => {
    const onStale = vi.fn();

    toastCuratorError(problem("STALE"), { onStale });
    toastCuratorError(problem("NAME_TAKEN"), { onStale });

    expect(onStale).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenCalledTimes(2);
  });
});
