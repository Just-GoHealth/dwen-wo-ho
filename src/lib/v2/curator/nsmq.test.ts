import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/v2/http";
import { nsmqCurator } from "./nsmq";
import { call, json, useFetchMock } from "./fetch.test-helper";

describe("nsmqCurator", () => {
  const fetchMock = useFetchMock();

  it("reads and creates versions", async () => {
    await nsmqCurator.versions();
    await nsmqCurator.version("NSMQ 2026");
    await nsmqCurator.createVersion({
      code: "NSMQ26",
      label: "NSMQ 2026",
      status: "OPENS_SOON",
    });

    expect(call(fetchMock, 0)).toMatchObject({
      url: "/versions",
      method: "GET",
    });
    expect(call(fetchMock, 1).url).toBe("/versions/NSMQ%202026");
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/versions",
      method: "POST",
      body: { code: "NSMQ26", label: "NSMQ 2026", status: "OPENS_SOON" },
    });
    expect(call(fetchMock, 2).headers["X-XSRF-TOKEN"]).toBe("tok");
  });

  it("patches a version with its version number", async () => {
    await nsmqCurator.updateVersion("NSMQ26", {
      version: 3,
      startsAt: "2026-11-01T00:00:00Z",
    });

    expect(call(fetchMock)).toMatchObject({
      url: "/versions/NSMQ26",
      method: "PATCH",
      body: { version: 3, startsAt: "2026-11-01T00:00:00Z" },
    });
  });

  it("tags, lists, boards and untags teams", async () => {
    await nsmqCurator.tagTeams("V1", ["c1", "c2"]);
    await nsmqCurator.teams("V1");
    await nsmqCurator.board("V1");
    await nsmqCurator.untagTeam("V1", "c1");
    await nsmqCurator.updateTeam("t1", { seatCapacity: 30, status: "ACTIVE" });

    expect(call(fetchMock, 0)).toMatchObject({
      url: "/versions/V1/teams",
      method: "POST",
      body: { campusIds: ["c1", "c2"] },
    });
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/versions/V1/teams",
      method: "GET",
    });
    expect(call(fetchMock, 2).url).toBe("/versions/V1/board");
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/versions/V1/teams/c1",
      method: "DELETE",
    });
    expect(call(fetchMock, 4)).toMatchObject({
      url: "/teams/t1",
      method: "PATCH",
      body: { seatCapacity: 30, status: "ACTIVE" },
    });
  });

  it("mints, lists and revokes access codes", async () => {
    await nsmqCurator.mintCodes("t1", { count: 2, seatLabels: ["A", "B"] });
    await nsmqCurator.codes("t1");
    await nsmqCurator.revokeCode("k1", "lost");
    await nsmqCurator.revokeCode("k2");

    expect(call(fetchMock, 0)).toMatchObject({
      url: "/teams/t1/codes",
      method: "POST",
      body: { count: 2, seatLabels: ["A", "B"] },
    });
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/teams/t1/codes",
      method: "GET",
    });
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/codes/k1/revoke",
      method: "POST",
      body: { reason: "lost" },
    });
    expect(call(fetchMock, 3).body).toEqual({ reason: null });
  });

  it("exports codes as CSV text", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("seat,code\nA,ABC\n", {
        status: 200,
        headers: { "content-type": "text/csv" },
      }),
    );

    const csv = await nsmqCurator.exportCodes("t1");

    expect(csv).toBe("seat,code\nA,ABC\n");
    expect(fetchMock.mock.calls[0]![0]).toBe("/teams/t1/codes/export");
  });

  it("raises CAPACITY_REACHED as an ApiError", async () => {
    fetchMock.mockResolvedValueOnce(
      json(
        {
          status: 422,
          code: "CAPACITY_REACHED",
          detail: "That would issue more codes than the team has seats.",
        },
        422,
      ),
    );

    const error = await nsmqCurator
      .mintCodes("t1", { count: 500 })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).code).toBe("CAPACITY_REACHED");
  });

  it("manages fixtures", async () => {
    await nsmqCurator.fixtures("t1");
    await nsmqCurator.createFixture("t1", {
      roundName: "Round 1",
      kickoffAt: "2026-11-02T09:00:00Z",
      timezone: "Africa/Accra",
    });
    await nsmqCurator.updateFixture("f1", { version: 1, venue: "Hall" });
    await nsmqCurator.setOutcome("f1", "ELIMINATED");
    await nsmqCurator.cancelFixture("f1");
    await nsmqCurator.deleteFixture("f1");

    expect(call(fetchMock, 0)).toMatchObject({
      url: "/teams/t1/fixtures",
      method: "GET",
    });
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/teams/t1/fixtures",
      method: "POST",
      body: { roundName: "Round 1", kickoffAt: "2026-11-02T09:00:00Z" },
    });
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/fixtures/f1",
      method: "PATCH",
      body: { version: 1, venue: "Hall" },
    });
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/fixtures/f1/outcome",
      method: "PUT",
      body: { outcome: "ELIMINATED" },
    });
    expect(call(fetchMock, 4)).toMatchObject({
      url: "/fixtures/f1/cancel",
      method: "POST",
    });
    expect(call(fetchMock, 5)).toMatchObject({
      url: "/fixtures/f1",
      method: "DELETE",
    });
  });

  it("imports fixtures as a plain array", async () => {
    const rows = [
      { campusId: "c1", roundName: "R1", kickoffAt: "2026-11-02T09:00:00Z" },
    ];

    await nsmqCurator.importFixtures("V1", rows);

    expect(call(fetchMock)).toMatchObject({
      url: "/versions/V1/fixtures/import",
      method: "POST",
      body: rows,
    });
  });
});
