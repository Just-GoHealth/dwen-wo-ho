import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/v2/http";
import {
  firstMissingStep,
  patchProviderProfile,
  toE164Phone,
} from "@/lib/utils/provider/profile-patch";
import type { ProviderProfile } from "@/lib/v2/types";

const profile = (version: number, phone: string | null = null) =>
  ({ id: "p1", version, phone }) as ProviderProfile;

describe("patchProviderProfile (409 STALE)", () => {
  it("sends the version it was given", async () => {
    const patch = vi.fn().mockResolvedValue(profile(4, "+233241234567"));
    const reload = vi.fn();

    const out = await patchProviderProfile(
      profile(3),
      { phone: "+233241234567" },
      { patch, reload },
    );

    expect(patch).toHaveBeenCalledWith({ phone: "+233241234567", version: 3 });
    expect(out).toEqual({
      kind: "saved",
      profile: profile(4, "+233241234567"),
    });
    expect(reload).not.toHaveBeenCalled();
  });

  it("reloads and reports instead of retrying on STALE", async () => {
    const patch = vi.fn().mockRejectedValue(
      new ApiError({
        status: 409,
        code: "STALE",
        detail: "This was changed by someone else. Reload and try again.",
      }),
    );
    const reload = vi.fn().mockResolvedValue(profile(7, "+233200000000"));

    const out = await patchProviderProfile(
      profile(3),
      { phone: "+233241234567" },
      { patch, reload },
    );

    expect(patch).toHaveBeenCalledTimes(1);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(out).toEqual({
      kind: "stale",
      profile: profile(7, "+233200000000"),
      message: "This was changed by someone else. Reload and try again.",
    });
  });

  it("rethrows other errors", async () => {
    const err = new ApiError({ status: 400, code: "VALIDATION", detail: "x" });
    await expect(
      patchProviderProfile(
        profile(1),
        {},
        {
          patch: vi.fn().mockRejectedValue(err),
          reload: vi.fn(),
        },
      ),
    ).rejects.toBe(err);
  });
});

describe("firstMissingStep", () => {
  it.each([
    [["photo", "phone"], 0],
    [["phone", "roleCategoryIds"], 1],
    [["roleCategoryIds"], 2],
    [["title"], 2],
    [[], null],
  ] as const)("%j → %s", (missing, step) => {
    expect(firstMissingStep(missing)).toBe(step);
  });
});

describe("toE164Phone", () => {
  it.each([
    ["0241234567", "+233241234567"],
    ["241234567", "+233241234567"],
    ["+1 617 555 0123", "+16175550123"],
    ["00233241234567", "+233241234567"],
    ["", ""],
  ])("%s → %s", (raw, out) => {
    expect(toE164Phone(raw)).toBe(out);
  });
});
