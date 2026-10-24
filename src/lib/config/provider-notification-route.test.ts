import { describe, expect, it } from "vitest";
import { getProviderNotificationRoute } from "./provider-notification-route";
import type { Notification } from "@/lib/v2/types";

const n = (over: Partial<Notification>): Notification => ({
  id: "n1",
  campusId: null,
  type: "NEW_RESULTS",
  title: "t",
  body: "b",
  link: null,
  data: {},
  readAt: null,
  createdAt: "2026-10-24T09:00:00Z",
  ...over,
});

describe("getProviderNotificationRoute", () => {
  it("maps the API result link onto the app's patient page", () => {
    expect(
      getProviderNotificationRoute(
        n({
          type: "URGENT_RESULT",
          link: "/results/r-9",
          data: { resultId: "r-9" },
        }),
      ),
    ).toBe("/provider/patients/r-9");
    expect(
      getProviderNotificationRoute(
        n({ type: "PATIENT_SEEN", link: "/results/r-1" }),
      ),
    ).toBe("/provider/patients/r-1");
  });

  it("opens the campus for campus-scoped types", () => {
    expect(
      getProviderNotificationRoute(n({ data: { campusId: "c1", count: 3 } })),
    ).toBe("/provider/schools/c1");
  });

  it("sends application decisions to the right screen", () => {
    expect(
      getProviderNotificationRoute(n({ type: "APPLICATION_ACCEPTED" })),
    ).toBe("/provider");
    expect(
      getProviderNotificationRoute(n({ type: "APPLICATION_REJECTED" })),
    ).toBe("/provider/application");
  });
});
