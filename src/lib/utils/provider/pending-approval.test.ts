import { describe, expect, it } from "vitest";
import { toPendingApprovalUserInfo } from "./pending-approval";

describe("toPendingApprovalUserInfo", () => {
  it("builds the header from the v2 profile", () => {
    const result = toPendingApprovalUserInfo({
      title: "Dr",
      fullName: "Ama Mensah",
      roleGroups: [{ id: "r1", name: "Psychiatry" }],
      photo: { url: "https://x/full.webp", thumbnailUrl: "https://x/t.webp" },
      submittedAt: "2024-01-15T00:00:00.000Z",
    });

    expect(result.name).toBe("Dr Ama Mensah");
    expect(result.title).toBe("Psychiatry");
    expect(result.profileImage).toBe("https://x/t.webp");
    expect(result.timeAgo).not.toBe("Recently");
  });

  it("returns defaults when the profile is missing", () => {
    expect(toPendingApprovalUserInfo()).toEqual({
      name: "",
      title: "",
      specialty: "",
      profileImage: undefined,
      timeAgo: "Recently",
    });
  });
});
