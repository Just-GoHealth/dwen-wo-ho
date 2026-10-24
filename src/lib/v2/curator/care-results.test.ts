import { describe, expect, it } from "vitest";
import { careCurator } from "./care";
import { resultsCurator } from "./results";
import { call, useFetchMock } from "./fetch.test-helper";

describe("careCurator", () => {
  const fetchMock = useFetchMock();

  it("reads outcomes and the waiting room, and links treatments", async () => {
    await careCurator.outcomes({ app: "QUICK_SCREEN", q: "sleep", all: true });
    await careCurator.waitingRoom("ACCOUNT");
    await careCurator.waitingRoom();
    await careCurator.linkTreatments("o1", [{ treatmentId: "t1", rank: 1 }]);

    expect(call(fetchMock, 0).url).toBe(
      "/care/outcomes?app=QUICK_SCREEN&q=sleep&all=true",
    );
    expect(call(fetchMock, 1).url).toBe("/care/waiting-room?app=ACCOUNT");
    expect(call(fetchMock, 2).url).toBe("/care/waiting-room");
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/care/outcomes/o1/treatments",
      method: "PUT",
      body: [{ treatmentId: "t1", rank: 1 }],
    });
  });

  it("manages treatments", async () => {
    await careCurator.treatments();
    await careCurator.createTreatment("Breathing", 2);
    await careCurator.createTreatment("Walk");
    await careCurator.updateTreatment("t1", {
      version: 1,
      name: "Deep breathing",
    });
    await careCurator.uploadTreatmentPhoto("t1", new Blob(["x"]));

    expect(call(fetchMock, 0).url).toBe("/treatments");
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/treatments",
      method: "POST",
      body: { name: "Breathing", defaultRank: 2 },
    });
    expect(call(fetchMock, 2).body).toEqual({
      name: "Walk",
      defaultRank: null,
    });
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/treatments/t1",
      method: "PATCH",
      body: { version: 1, name: "Deep breathing" },
    });
    expect(call(fetchMock, 4)).toMatchObject({
      url: "/treatments/t1/photo",
      method: "PUT",
    });
  });
});

describe("resultsCurator", () => {
  const fetchMock = useFetchMock();

  it("lists results with repeated outcome filters and the awaiting flag", async () => {
    await resultsCurator.list("c1", {
      awaiting: true,
      period: "WEEK",
      outcome: ["GMH:Poor", "SLEEP:Good"],
      page: 0,
      size: 100,
    });
    await resultsCurator.summary("c1", { active: true });

    expect(call(fetchMock, 0).url).toBe(
      "/campuses/c1/results?awaiting=true&period=WEEK&outcome=GMH%3APoor&outcome=SLEEP%3AGood&page=0&size=100",
    );
    expect(call(fetchMock, 1).url).toBe(
      "/campuses/c1/results/summary?active=true",
    );
  });

  it("opens, comments on, deactivates and accepts results", async () => {
    await resultsCurator.detail("r1");
    await resultsCurator.comments("r1");
    await resultsCurator.addComment("r1", "Called home");
    await resultsCurator.setActive("r1", false);
    await resultsCurator.accept("r1");
    await resultsCurator.acceptAll("c1");

    expect(call(fetchMock, 0)).toMatchObject({
      url: "/results/r1",
      method: "GET",
    });
    expect(call(fetchMock, 1).url).toBe("/results/r1/comments");
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/results/r1/comments",
      method: "POST",
      body: { body: "Called home" },
    });
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/results/r1",
      method: "PATCH",
      body: { active: false },
    });
    expect(call(fetchMock, 4)).toMatchObject({
      url: "/results/r1/accept",
      method: "POST",
    });
    expect(call(fetchMock, 5)).toMatchObject({
      url: "/campuses/c1/results/accept-all",
      method: "POST",
    });
  });

  it("reads the urgent views", async () => {
    await resultsCurator.urgent("c1");
    await resultsCurator.urgent();
    await resultsCurator.untaggedRuns();
    await resultsCurator.run("run1");
    await resultsCurator.careCases("c1");

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "/results/urgent?campusId=c1",
      "/results/urgent",
      "/runs/untagged",
      "/runs/run1",
      "/care-cases?campusId=c1",
    ]);
  });
});
