import { describe, expect, it } from "vitest";
import { joinRequestsCurator, providersCurator } from "./providers";
import { rolesCurator } from "./roles";
import { auditCurator } from "./audit";
import { call, useFetchMock } from "./fetch.test-helper";

describe("providersCurator", () => {
  const fetchMock = useFetchMock();

  it("lists and reads providers", async () => {
    await providersCurator.list({
      q: "ama",
      status: "PENDING",
      roleCategory: "r1",
      size: 100,
    });
    await providersCurator.detail("p1");

    expect(call(fetchMock, 0).url).toBe(
      "/providers?q=ama&status=PENDING&roleCategory=r1&size=100",
    );
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/providers/p1",
      method: "GET",
    });
  });

  it("creates, edits, photographs and invites a Studios provider", async () => {
    await providersCurator.create({ fullName: "Ama Owusu", clinical: true });
    await providersCurator.update("p1", { version: 3, email: "ama@x.org" });
    await providersCurator.uploadPhoto("p1", new Blob(["x"]));
    await providersCurator.invite("p1");

    expect(call(fetchMock, 0)).toMatchObject({
      url: "/providers",
      method: "POST",
      body: { fullName: "Ama Owusu", clinical: true },
    });
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/providers/p1",
      method: "PATCH",
      body: { version: 3, email: "ama@x.org" },
    });
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/providers/p1/photo",
      method: "PUT",
    });
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/providers/p1/invite",
      method: "POST",
    });
  });
});

describe("joinRequestsCurator", () => {
  const fetchMock = useFetchMock();

  it("lists the queue, one hub's Just In, and decides requests", async () => {
    await joinRequestsCurator.list({
      status: "PENDING",
      kind: "PROVIDER_APPLICATION",
    });
    await joinRequestsCurator.list({
      targetType: "CAMPUS",
      targetId: "c1",
      page: 1,
    });
    await joinRequestsCurator.approve("j1", "r1");
    await joinRequestsCurator.approve("j2");
    await joinRequestsCurator.decline("j3");

    expect(call(fetchMock, 0).url).toBe(
      "/join-requests?status=PENDING&kind=PROVIDER_APPLICATION",
    );
    expect(call(fetchMock, 1).url).toBe(
      "/join-requests?targetType=CAMPUS&targetId=c1&page=1",
    );
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/join-requests/j1/approve",
      method: "POST",
      body: { roleCategoryId: "r1" },
    });
    expect(call(fetchMock, 3).body).toEqual({ roleCategoryId: null });
    expect(call(fetchMock, 4)).toMatchObject({
      url: "/join-requests/j3/decline",
      method: "POST",
      body: undefined,
    });
  });
});

describe("rolesCurator", () => {
  const fetchMock = useFetchMock();

  it("manages role groups and roles", async () => {
    await rolesCurator.categories();
    await rolesCurator.createCategory("Nursing");
    await rolesCurator.updateCategory("rc1", { version: 1, dormant: true });
    await rolesCurator.setRole("rc1", "role1", false);
    await rolesCurator.roles();
    await rolesCurator.createRole("Midwife", "🤱");

    expect(call(fetchMock, 0).url).toBe("/role-categories");
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/role-categories",
      method: "POST",
      body: { name: "Nursing", dormant: false },
    });
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/role-categories/rc1",
      method: "PATCH",
      body: { version: 1, dormant: true },
    });
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/role-categories/rc1/roles/role1",
      method: "PUT",
      body: { active: false },
    });
    expect(call(fetchMock, 4).url).toBe("/roles");
    expect(call(fetchMock, 5)).toMatchObject({
      url: "/roles",
      method: "POST",
      body: { name: "Midwife", emoji: "🤱" },
    });
  });
});

describe("auditCurator", () => {
  const fetchMock = useFetchMock();

  it("filters the audit history", async () => {
    await auditCurator.list({
      entityType: "CAMPUS",
      campusId: "c1",
      page: 0,
      size: 50,
    });
    await auditCurator.list();

    expect(call(fetchMock, 0).url).toBe(
      "/audit?entityType=CAMPUS&campusId=c1&page=0&size=50",
    );
    expect(call(fetchMock, 1)).toMatchObject({ url: "/audit", method: "GET" });
  });
});
